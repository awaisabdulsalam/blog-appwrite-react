import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../../appwrite/config";
import { Button, Input, Select, RTE } from "../index";

//?  Jb b user post ko edit krne k liye button pe click kre ga
//?  ye component run hoga or post ki sari information props mai le aye ga
const PostForm = ({ post }) => {
  //*  Kisi b field ko continues monitor krne k liye WATCH
  //*  Form ki kisi b value ko SET krwane k liye setValue
  //*  Form ki kisi b value ko GET krne k liye getValue
  //*  Form ka control lene k liye CONTROL
  const { register, handleSubmit, watch, setValue, getValues, control } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  //*  CHANGED state.user.userData ->>  state.auth.userData
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  //?  When form is submitted react-hook-form collects all the data from 
  //?  registered Inputs and passes it to this submit function in the 
  //?  form of an OBJECT -> { title:"", slug: "", content: "", status: "", image: [File object]}
  const submit = async (data) => {

    console.log("Submitted form data: ", data);

    if (post) {
      console.log("uploading file...");
      const file = data.image[0]
        ? appwriteService.uploadFile(data.image[0])
        : null;
      console.log("uploaded file...", file);
      
      if (file) {
        appwriteService.deleteFile(post.featuredimage);
      }
      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredimage: file ? file.$id : undefined,
      });
      if(dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      const file = await appwriteService.uploadFile(data.image[0]);

      if (file) {
        const fileId = file.$id;
        data.featuredimage = fileId;
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData?.$id,
        });
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title, { shouldValidate: true }));
      }
      return () => {
        subscription.unsubscribe();
      };
    });
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredimage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
