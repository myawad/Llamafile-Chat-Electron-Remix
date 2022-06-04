
import {
  ExitIcon,
  GearIcon,
  HamburgerMenuIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { type ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useNavigation,
  useParams,
} from "@remix-run/react";
import * as React from "react";
import { serverOnly$ } from "vite-env-only";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { listChats } from "@/data.server/chat";
import { getSettings } from "@/data.server/settings";
import { cn } from "@/lib/utils";

export const loader = serverOnly$(async () => {
  const [chats, settings] = await Promise.all([listChats(), getSettings()]);

  if (!settings.baseLlamafile || !settings.activeLLM) {
    throw redirect("/setup");
  }

  return { chats };
});

export default function Playground() {
  const { chats } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigation = useNavigation();
  const { chatId } = useParams();
  const revalidating = navigation.state !== "idle";

  const [explicitelyShowList, setExplicitelyShowList] = React.useState(false);
  const showList = explicitelyShowList || location.pathname === "/";

  const closeList = () => setExplicitelyShowList(false);
  const openList = () => setExplicitelyShowList(true);

  return (
    <div className="h-full flex flex-col">
      <header className="container flex justify-between py-4 items-center gap-4">
        <div className="flex items-center gap-4">
          {!showList ? (
            <Button asChild size="icon" variant="outline" className="md:hidden">
              <Link
                to="/"
                onClick={(event) => {
                  event.preventDefault();
                  openList();
                }}
              >
                <span className="sr-only">show list of chats</span>
                <HamburgerMenuIcon aria-hidden="true" />
              </Link>
            </Button>
          ) : explicitelyShowList ? (
            <Button
              size="icon"
              variant="outline"
              className="md:hidden"
              onClick={() => {
                closeList();
              }}
            >
              <span className="sr-only">return to chat</span>
              <ExitIcon aria-hidden="true" />
            </Button>
          ) : null}
          <img src="/favicon.png" alt="Remix LLM" className="w-8 h-8" />
          {/* <h2 className="text-lg font-semibold">Remix LLM</h2> */}
        </div>
        <div className="flex flex-1 items-center gap-4 relative">
          <DownloadProgress />
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="icon" variant="outline">
                  <Link to="/chat" onClick={closeList}>
                    <span className="sr-only">New Chat</span>
                    <PlusIcon />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Chat</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="icon" variant="outline">
                  <Link to="/settings" onClick={closeList}>
                    <span className="sr-only">Settings</span>
                    <GearIcon />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <Separator />

      <div className="flex flex-1 overflow-y-hidden relative">
        {revalidating && (
          <div className="absolute top-0 left-0 right-0 z-10">
            <div className="h-1 w-full bg-accent overflow-hidden">
              <div className="animate-progress w-full h-full bg-primary origin-left-right"></div>