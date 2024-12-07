"use client";
import React from "react";
// import { api } from "~/trpc/react";

const Testbutton = () => {
  // const test_the_button = api.post.test_web_scraper.useMutation({
  //   onSuccess: (e) => {
  //     console.log(e);
  //   },
  // });

  function handle_test_the_button() {
    // test_the_button.mutate();
    console.log("paloki");
  }

  return (
    <div>
      {" "}
      <button
        onClick={() => {
          handle_test_the_button();
        }}
        className="m-5 bg-black p-5 text-white outline outline-white"
      >
        Testbutton
      </button>{" "}
    </div>
  );
};

export default Testbutton;
