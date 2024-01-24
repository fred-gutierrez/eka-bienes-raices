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

// The code below is partitioned on 5 parts (1. Fetching - 2. Processing Data - 3. Filtering Data - 4. Writing Data to File - 5. Error handling)

const fetchData = async () => {
  // 1. Fetch Data
  const facebookData: FacebookPost = await fetch(
    `https://graph.facebook.com/me?fields=posts{message,attachments{subattachments{media{image{src}}}}}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`,
  ).then((res) => res.json());

  const { data: existingData } = await supabase
    .from('posts_tests')
    .select(`id, message`)

  const newPostsJSON = [];

  // 2. Processing Data
  for (const post of facebookData.posts?.data || []) {
    // Compares old posts to the new ones and adds the data to the start of the array
    const existingPostCheck = existingData?.find((existingPost) => existingPost.id === post.id || existingPost.message === post.message);

    if (existingPostCheck) {
      console.log(`Duplicated post with message: ${post.message.substring(0, 50)}, and id: ${post.id}. Skipping.`);
    } else {
      newPostsJSON.unshift(post);
    }

    // Process the image array
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

              const imagePath = await downloadImages(
                image.media.image.src,
                post.id,
              );

              image.media.image.src = imagePath as any;
            }
          }
          imageSubArray.data = slicedImageArray as any;
        }
      }
    }
  }

  const filteredData = Object.values([...newPostsJSON]).filter((post) => {
    const words = post.message?.split(" ");
    return words?.length >= 15;
  });

  const csvArray = filteredData.map(post => {
    const csvObject: { [key: string]: string } = {
      id: post.id,
      message: post.message,
      ...(post.attachments?.data || []).reduce((acc, attachment) => {
        (attachment.subattachments?.data || []).forEach((subattachment, subattachmentIndex) => {
          if (subattachment.media?.image?.src) {
            const columnName = `attachments/data/0/subattachments/data/${subattachmentIndex}/media/image/src`;
            acc[columnName] = subattachment.media.image.src;
          }
        });
        return acc;
      }, {}),
    };

    return csvObject;
  });

  if (filteredData.length > 0) {
    const { data, error } = await supabase
      .from('posts_tests')
      .upsert({ csvArray }, { onConflict: 'id' })

    if (data) {
      console.log(`Wrote ${newPostsJSON.length} new posts and updated ${existingData.length - newPostsJSON.length} existing posts.`)
    }

    if (error) {
      console.error("Error inserting data: ", error)
    }
  }
}

fetchData()
