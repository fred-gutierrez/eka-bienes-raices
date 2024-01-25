import download from "download";
import dotenv from 'dotenv';
import fs from "fs";

dotenv.config();

const postsDataFilePath = "./src/data/postsData.json";

let existingData = [];

// Checks to see if there is existing data in the path provided
try {
  existingData = JSON.parse(fs.readFileSync(postsDataFilePath));
} catch (err) {
  console.warn("No existing data found.");
}

const downloadImage = async (imageUrl, postID) => {
  try {
    const filename = imageUrl.substring(
      imageUrl.lastIndexOf("/") + 1,
      imageUrl.lastIndexOf("?"),
    );

    const folderPath = `./public/images/${postID}/`;
    const imagePath = `./public/images/${postID}/${filename}`;
    const imagePathPublic = `/images/${postID}/${filename}`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    if (!fs.existsSync(imagePath)) {
      const imageData = await download(imageUrl);
      fs.writeFileSync(imagePath, imageData);
      console.log(`Image saved to ${imagePath}`);
    } else {
      console.log(`Image ${imagePath} already exists. Skipping download.`);
    }

    return imagePathPublic;
  } catch (err) {
    console.error(`Error saving image: ${err}`);
    return null;
  }
};

const fetchData = async () => {
  const data = await fetch(
    `https://graph.facebook.com/me?fields=posts{message,attachments{subattachments{media{image{src}}}}}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`,
  ).then((res) => res.json());

  const newPosts = [];

  for (const post of data.posts?.data || []) {
    const existingPost = existingData.find(
      (p) => p.id === post.id || p.message === post.message,
    );

    if (existingPost) {
      // Object.assign(existingPost, post);
      console.log(`Duplicated post with message: ${post.message}. Skipping.`);
    } else {
      newPosts.unshift(post);
    }

    const postAttachments = post.attachments;
    if (postAttachments && postAttachments.data.length > 0) {
      for (const attachment of postAttachments.data) {
        const postSubAttachments = attachment.subattachments;
        if (postSubAttachments && postSubAttachments.data.length > 0) {
          const slicedSubAttachments = postSubAttachments.data.slice(0, 5);
          for (const subAttachment of slicedSubAttachments) {
            if (subAttachment.media && subAttachment.media.image) {
              subAttachment.media.image.src =
                subAttachment.media.image.src.replace(
                  /^http:\/\//i,
                  "https://",
                );

              const imagePathPublic = await downloadImage(
                subAttachment.media.image.src,
                post.id,
              );

              if (imagePathPublic) {
                subAttachment.media.image.src = imagePathPublic;
              }
            }
          }
          postSubAttachments.data = slicedSubAttachments;
        }
      }
    }
  }

  const filteredData = Object.values([...newPosts, ...existingData]).filter(
    (post) => {
      const words = post.message?.split(" ");
      return words?.length >= 15;
    },
  );

  if (filteredData.length > 0) {
    fs.writeFileSync(postsDataFilePath, JSON.stringify(filteredData));
    console.log(
      `Wrote ${newPosts.length} new posts and updated ${existingData.length - newPosts.length
      } existing posts.`,
    );
  } else {
    console.error("Error: No data found in response");
  }
};

fetchData();
