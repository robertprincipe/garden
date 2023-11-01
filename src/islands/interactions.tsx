"use client";

import * as React from "react";
import { Icon } from "~/components/icon";

import { getInteractionsAction } from "~/server/actions/interactions";
import { Interaction } from "~/data/validations/interaction";
import { AddInteractionForm } from "~/forms/add-interaction-form";

type InteractionsProps = {
  chapterId: string;
  courseId: string;
};

export const dynamic = "force-dynamic";

export function Interactions({ chapterId, courseId }: InteractionsProps) {
  const [comments, setComments] = React.useState<Interaction[] | undefined>();
  // if (error) return null;

  const getInteractions = async () => {
    const { result: comments, error } = await getInteractionsAction({
      chapterId,
    });

    if (error) {
      console.log(error);
      return;
    }

    setComments(comments);
  };

  React.useEffect(() => {
    getInteractions();
  }, []);

  return (
    <>
      <AddInteractionForm
        chapterId={chapterId}
        courseId={courseId}
        setComments={setComments}
      />
      <div className="divide-y divide-zinc-200">
        <div>
          {comments?.length
            ? comments.map((comment) => (
                <article className="py-2" key={comment.id}>
                  <div className="flex items-center space-x-2">
                    <img
                      src={
                        comment.user?.image ??
                        "https://ideogram.ai/api/images/direct/eRAyjyoRSlKi0iHoc4Sebw"
                      }
                      alt=""
                      className="h-10 w-10 rounded-full"
                    />
                    <span className="font-semibold text-card-foreground">
                      {comment.user?.name}
                    </span>
                  </div>
                  <p className="my-2 text-sm font-medium text-muted-foreground">
                    {comment.content}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <button
                      type="button"
                      className="flex items-center space-x-1"
                    >
                      <Icon icon="ph:share-fat-duotone" className="text-lg" />
                      <span>Reply</span>
                    </button>
                    <span>&bull;</span>
                    <p>Show replies</p>
                  </div>
                </article>
              ))
            : null}

          <article className="ml-6 border-l border-l-border py-2 pl-4">
            <div className="flex items-center space-x-2">
              <img
                src="https://ideogram.ai/api/images/direct/eRAyjyoRSlKi0iHoc4Sebw"
                alt=""
                className="h-10 w-10 rounded-full"
              />
              <span className="font-semibold text-card-foreground">
                Robin Sherbasky
              </span>
            </div>
            <p className="my-2 text-sm font-medium text-muted-foreground">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque,
              impedit!
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <button type="button" className="flex items-center space-x-1">
                <Icon icon="ph:share-fat-duotone" className="text-lg" />
                <span>Reply</span>
              </button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
