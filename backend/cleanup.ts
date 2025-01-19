export const deleteSoldPosts = async (supabaseClient: any) => {
  try {
    const { data: posts, error: fetchError } = await supabaseClient
      .from("posts")
      .select("id, message")
      .or("message.ilike.%alquilado%,message.ilike.%alquilada%,message.ilike.%vendido%,message.ilike.%vendida%")

    if (fetchError) {
      throw new Error(`Error fetching posts: ${fetchError.message}`)
    }

    if (!posts || posts.length === 0) {
      console.log("No posts found containing 'alquilado', 'alquilada', 'vendido' or 'vendida'.");
      return;
    }

    for (const post of posts) {
      const { id } = post;

      // Delete bucket/image folder connected to the post
      const { error: deleteImageError } = await supabaseClient
        .storage
        .from("images2")
        .remove([`${id}`])

      if (deleteImageError) {
        console.error(`Error deleting images for post ID ${id}: ${deleteImageError.message}`);
        continue;
      }

      // Delete the post from the database
      const { error: deletePostError } = await supabaseClient
        .from("posts")
        .delete()
        .eq("id", id)

      if (deletePostError) {
        console.error(`Error deleting post ID ${id}: ${deletePostError.message}`);
      } else {
        console.log(`Successfully deleted post ID ${id} and its images.`)
      }
    }
  }
  catch (error) {
    console.error(`deletePost function failed with the error: ${error}`);
  }
}
