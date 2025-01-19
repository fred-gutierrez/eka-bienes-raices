import * as dotenv from 'dotenv';
let download = require("download")
import { deleteSoldPosts } from "./cleanup.ts"
import { createClient } from "@supabase/supabase-js";
import { FacebookPost } from "../src/types/postTypes"

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseSRK = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabaseClient = createClient(supabaseUrl, supabaseSRK);

const downloadAndUploadImages = async (imageUrl: string, postID: string) => {
  try {
    // Extract filename from the image URL
    const filename = imageUrl.substring(
      imageUrl.lastIndexOf("/") + 1,
      imageUrl.lastIndexOf("?"),
    );

    // Download image
    const imageData = await download(imageUrl)

    // Upload image to Supabase storage
    const { error } = await supabaseClient.storage
      .from('images2')
      .upload(`${postID}/${filename}`, imageData, { contentType: 'image/jpg' })

    if (error) {
      console.error(`Error uploading file with postID: ${postID} to Supabase, with the error message:`, error.message);
    } else {
      console.log(`File uploaded to Supabase storage: ${postID}/${filename}`)
    }
  }

  catch (error) {
    console.error(`Error in the downloadImages function: ${error}`)
  }
}

interface NewPost {
  id: string,
  message: string,
  images: string[]
}

const newPosts: NewPost[] = []

const uploadNewPosts = async () => {
  try {
    const facebookData: FacebookPost = await fetch(
      `https://graph.facebook.com/me?fields=posts{message,attachments{subattachments{media{image{src}}}}}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`,
    ).then((res) => res.json());

    // Process each post from the Facebook data
    for (const post of facebookData.posts?.data || []) {
      const newPost: NewPost = {
        id: post.id,
        message: post.message,
        images: []
      }

      // Check if post has attachments with images
      const imageArray = post.attachments;
      if (imageArray && imageArray.data.length > 0) {
        // Process up to 5 images per post
        for (const imageDataArray of imageArray.data) {
          const imageSubArray = imageDataArray.subattachments;

          if (imageSubArray && imageSubArray.data.length > 0) {
            const slicedImageArray = imageSubArray.data.slice(0, 5);

            // Process each image
            for (const image of slicedImageArray) {
              if (image.media && image.media.image) {
                // Convert image URL to HTTPS
                image.media.image.src =
                  image.media.image.src.replace(
                    /^http:\/\//i,
                    "https://",
                  ) as any;

                // Download and Upload each Image
                await downloadAndUploadImages(image.media.image.src, post.id);

                // Repeated function to extract the filename from the Image URL
                const filename = image.media.image.src.substring(
                  image.media.image.src.lastIndexOf("/") + 1,
                  image.media.image.src.lastIndexOf("?"),
                );

                // And consequenly use it to store it in the rows properly
                newPost.images.push(`/images/${post.id}/${filename}`)
              }
            }
            imageSubArray.data = slicedImageArray as any;
          }
        }
      }

      newPosts.push(newPost)
    }

    // Filter posts based on the message length (Must be more than 15 characters)
    const filteredData = newPosts.filter((post) => post.message?.split(" ").length >= 15)

    // Insert new posts into the Supabase table
    if (filteredData.length > 0) {
      try {
        for (const postData of filteredData) {
          const { id, message, images } = postData;

          // Check if a post with the same message already exists
          const { data: existingPost } = await supabaseClient
            .from('posts')
            .select('id')
            .eq('message', message)
            .single();

          if (existingPost) {
            console.log(`Post with message "${message.substring(0, 45).replace("\n", " ")}" already exists. Skipping.`);
            continue;
          }

          // Construct upsert data
          const upsertData: { [key: string]: string } = {
            id,
            message,
          }

          images.forEach((image, index) => {
            upsertData[`attachments/data/0/subattachments/data/${index}/media/image/src`] = image;
          })

          // Upsert data into the Supabase table
          const { error } = await supabaseClient
            .from('posts')
            .upsert(upsertData, { onConflict: 'id' })

          if (error) {
            console.error("Error inserting data: ", error)
          } else {
            console.log(`Post with id ${upsertData.id} was added/updated successfully`)
          }
        }
      }
      catch (error) {
        console.error("Something happened", error)
      }
    }
  }
  catch (error) {
    console.error('Error in the fetchData function: ', error)
  }
  // Cleanup function to check for properties marked as sold
  deleteSoldPosts(supabaseClient)
}

uploadNewPosts()

// Simple placeholder to use when creating the .env
// NEXT_PUBLIC_SUPABASE_URL=
// NEXT_PUBLIC_SUPABASE_ANON_KEY=
// SUPABASE_SERVICE_ROLE_KEY=
// FACEBOOK_ACCESS_TOKEN=
