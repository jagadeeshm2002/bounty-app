"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function NewRepoPage() {
  const { data: session } = useSession();
  let username = session?.user?.username;
  const webhook = process.env.NEXT_PUBLIC_WEBHOOK_URL;

  const [repoName, setRepoName] = useState("");
  const [generatedName, setGeneratedName] = useState(`${webhook}/${username}`);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const webhookName = `${webhook}/${username}/${repoName}`;
    setGeneratedName(webhookName);
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedName);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <div className="flex flex-col px-5 w-full h-full">
      <div className="mb-4">
        <div className="flex flex-row justify-between items-center">
          <p className="font-mono text-4xl mb-3">Create a Webhook</p>
          <Button
            className=" hover:bg-gray-700 active:bg-gray-800 border border-gray-50 border-opacity-20"
            variant="default"
          >
            Back
          </Button>
        </div>

        <div className="flex flex-col border-2 border-gray-500 rounded-lg w-full h-full p-3 px-6 bg-gray-800 bg-opacity-50 ">
          <div>
            <div className="flex w-full">
              <form className="w-full" onSubmit={handleSubmit}>
                <label htmlFor="repo" className="block mb-2">
                  Repo Name
                </label>
                <Input
                  id="repo"
                  name="repo"
                  type="text"
                  placeholder="Enter Repo Name"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)} // Update the input state
                />

                <Button
                  type="submit"
                  className=" mt-5 hover:bg-gray-700 active:bg-gray-800 border border-gray-50 border-opacity-20"
                >
                  Generate
                </Button>
              </form>
            </div>

            <div className="flex flex-col mt-4 gap-3  ">
              <p className="text-lg font-semibold">WebHook for repo:</p>
              <div className="flex flex-row items-center space-x-2 border border-gray-500 rounded-lg p-3 bg-gray-950 relative ">
                <pre>{generatedName}</pre>
                <Button
                  className="text-sm absolute right-4 ease-linear"
                  onClick={handleCopy}
                >
                  {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col  w-full gap-3 mt-4 ">
            <p className="font-sans ">
              *After create webhook in github repo you can save it,this will
              test your webhook and store in your database. repo name must same
              as github
            </p>
            <Button
              className="w-32 hover:bg-gray-700 active:bg-gray-800 border border-gray-50 border-opacity-20"
              variant={"default"}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col border-2 border-gray-500 rounded-lg w-full h-full p-3 ">
        <div className="flex flex-col ">
          <p className="font-mono text-4xl">Guide:</p>
          <p>
            This guide help you to make a webhook for you repo in your github
            account
          </p>
        </div>

        <div className="grid grid-cols-2 grid-flow-row">
          <Image
            src="/guide/step_1.png"
            className="w-full h-full px-3 py-2"
            alt="steps"
            width={500}
            height={500}
          />
          <Image
            src="/guide/step_2.png"
            className="w-full h-full px-3 py-2"
            alt="steps"
            width={500}
            height={500}
          />
          <Image
            src="/guide/step_3.png"
            className="w-full h-full px-3 py-2"
            alt="steps"
            width={500}
            height={500}
          />
          <Image
            src="/guide/step_4.png"
            className="w-full h-full px-3 py-2"
            alt="steps"
            width={500}
            height={500}
          />
          <Image
            src="/guide/step_5.png"
            className="w-full h-full px-3 py-2"
            alt="steps"
            width={500}
            height={500}
          />
          <Image
            src="/guide/step_6.png"
            className="w-full h-full px-3 py-2"
            alt="steps"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
