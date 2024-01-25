import dotenv from 'dotenv';
import download from 'download'
import { createClient } from "@supabase/supabase-js";
import { FacebookPost } from "./src/types/postTypes.ts"

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseSRK = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseSRK);

const downloadImages = async (imageUrl: string, postID: string) => {
  try {
    const filename = imageUrl.substring(
      imageUrl.lastIndexOf("/") + 1,
      imageUrl.lastIndexOf("?"),
    );

    const imageData = await download(imageUrl)

    const { error } = await supabase.storage
      .from('images2')
      .upload(`${postID}/${filename}`, imageData, { contentType: 'image/jpg' })

    if (error) {
      console.error("Error uploading file to Supabase", error)
    } else {
      console.log(`File uploaded to Supabase storage: ${postID}/${filename}`)
    }
  }

  catch (error) {
    console.error('Error in the downloadImages function: ', error)
  }
}

interface newPosts {
  id: string,
  message: string,
  images: string[]
}

const newPosts: newPosts[] = []

const fetchData = async () => {
  const facebookData: FacebookPost = await fetch(
    `https://graph.facebook.com/me?fields=posts{message,attachments{subattachments{media{image{src}}}}}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`,
  ).then((res) => res.json());

  for (const post of facebookData.posts?.data || []) {
    const postsInfo: newPosts = {
      id: post.id,
      message: post.message,
      images: []
    }

    const imageArray = post.attachments;
    if (imageArray && imageArray.data.length > 0) {
      for (const imageDataArray of imageArray.data) {
        const imageSubArray = imageDataArray.subattachments;

        if (imageSubArray && imageSubArray.data.length > 0) {
          const slicedImageArray = imageSubArray.data.slice(0, 5);

          for (const image of slicedImageArray) {
            if (image.media && image.media.image) {
              image.media.image.src =
                image.media.image.src.replace(
                  /^http:\/\//i,
                  "https://",
                ) as any;

              // const imagePath = await downloadImages(
              //   image.media.image.src,
              //   post.id,
              // );

              const filename = image.media.image.src.substring(
                image.media.image.src.lastIndexOf("/") + 1,
                image.media.image.src.lastIndexOf("?"),
              );

              postsInfo.images.push(`/images/${post.id}/${filename}`)

              // image.media.image.src = imagePath as any;
            }
          }
          imageSubArray.data = slicedImageArray as any;
        }
      }
    }

    newPosts.push(postsInfo)
  }

  const filteredData = Object.values([...newPosts]).filter((post) => {
    const words = post.message?.split(" ");
    return words?.length >= 15;
  });

  // let upsertData = new Map();
  let upsertData: Object;

  if (filteredData.length > 0) {
    try {
      for (const postData of filteredData) {
        const { id, message, images } = postData;

        upsertData = {
          id,
          message,
        }

        images.forEach((image, index) => {
          upsertData[`attachments/data/0/subattachments/data/${index}/media/image/src`] = image;
        })
        // upsertData.set("id", postData.id)
        // upsertData.set("message", postData.message)
        // upsertData.set("firstImage", postData.images[0])
        // upsertData.set("secondImage", postData.images[1])
        // upsertData.set("thirdImage", postData.images[2])
        // upsertData.set("fourthImage", postData.images[3])
        // upsertData.set("fifthImage", postData.images[4])
      }

      const { data, error } = await supabase
        .from('posts_tests')
        .upsert({
          upsertData
          // id: upsertData.get("id"),
          // message: upsertData.get("message"),
          // "attachments/data/0/subattachments/data/0/media/image/src": upsertData.get("firstImage"),
          // "attachments/data/0/subattachments/data/1/media/image/src": upsertData.get("secondImage"),
          // "attachments/data/0/subattachments/data/2/media/image/src": upsertData.get("thirdImage"),
          // "attachments/data/0/subattachments/data/3/media/image/src": upsertData.get("fourthImage"),
          // "attachments/data/0/subattachments/data/4/media/image/src": upsertData.get("fifthImage"),
        }, { onConflict: 'id' })

      if (data) {
        // console.log(`Wrote ${upsertData.length} new posts and updated ${data.length - upsertData.length} existing posts.`)
        console.log("Posts were added yay!")
      }

      if (error) {
        console.error("Error inserting data: ", error)
      }
    }
    catch {
      console.error("Something happened")
    }
  }

}

fetchData()
