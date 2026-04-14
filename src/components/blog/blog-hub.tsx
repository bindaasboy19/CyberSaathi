"use client";

import { Heart, MessageCircleMore, PenSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { Textarea } from "@/components/ui/textarea";
import { mockComments, mockPosts } from "@/lib/data/content";
import {
  createComment,
  createPost,
  fetchComments,
  fetchPosts,
  incrementCounter,
} from "@/lib/firebase/firestore";
import { createId, formatRelativeDate } from "@/lib/utils";
import { commentSchema, postSchema } from "@/lib/validation/schemas";
import type { Comment, Post } from "@/types";

export function BlogHub() {
  const { user, profile, configured } = useAuth();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    type: "blog" as "blog" | "case",
    tags: "",
  });
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function hydrate() {
      if (!configured) {
        return;
      }

      try {
        const [postRows, commentRows] = await Promise.all([fetchPosts(), fetchComments()]);
        setPosts(postRows);
        setComments(commentRows);
      } catch {
        setError("Using demo content because Firestore is not connected.");
      }
    }

    void hydrate();
  }, [configured]);

  const commentsByPost = useMemo(
    () =>
      comments.reduce<Record<string, Comment[]>>((accumulator, comment) => {
        accumulator[comment.parentId] = [...(accumulator[comment.parentId] || []), comment];
        return accumulator;
      }, {}),
    [comments],
  );

  async function handleCreatePost() {
    setError(null);

    if (!user || !profile) {
      setError("Please sign in to publish blogs or case studies.");
      return;
    }

    const parsed = postSchema.safeParse(postForm);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid post.");
      return;
    }

    const tags = parsed.data.tags
      ? parsed.data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

    const nextPost: Post = {
      id: createId("post"),
      title: parsed.data.title,
      content: parsed.data.content,
      authorId: user.uid,
      authorName: profile.name,
      type: parsed.data.type,
      likes: 0,
      commentCount: 0,
      tags,
      createdAt: new Date().toISOString(),
    };

    setPosts((current) => [nextPost, ...current]);
    setPostForm({
      title: "",
      content: "",
      type: "blog",
      tags: "",
    });

    if (configured) {
      try {
        const id = await createPost({
          title: nextPost.title,
          content: nextPost.content,
          authorId: nextPost.authorId,
          authorName: nextPost.authorName,
          type: nextPost.type,
          tags: nextPost.tags,
        });

        setPosts((current) =>
          current.map((post) => (post.id === nextPost.id ? { ...post, id } : post)),
        );
      } catch {
        setError("Post was added locally, but Firestore sync failed.");
      }
    }
  }

  async function handleComment(postId: string) {
    setError(null);

    if (!user || !profile) {
      setError("Please sign in to comment.");
      return;
    }

    const text = commentDrafts[postId] ?? "";
    const parsed = commentSchema.safeParse({ text });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid comment.");
      return;
    }

    const nextComment: Comment = {
      id: createId("comment"),
      parentId: postId,
      userId: user.uid,
      authorName: profile.name,
      text: parsed.data.text,
      createdAt: new Date().toISOString(),
    };

    setComments((current) => [nextComment, ...current]);
    setCommentDrafts((current) => ({
      ...current,
      [postId]: "",
    }));
    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, commentCount: post.commentCount + 1 } : post,
      ),
    );

    if (configured) {
      try {
        const id = await createComment({
          parentId: postId,
          userId: nextComment.userId,
          authorName: nextComment.authorName,
          text: nextComment.text,
        });

        setComments((current) =>
          current.map((comment) =>
            comment.id === nextComment.id ? { ...comment, id } : comment,
          ),
        );
      } catch {
        setError("Comment was added locally, but Firestore sync failed.");
      }
    }
  }

  async function handleLike(postId: string) {
    setPosts((current) =>
      current.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)),
    );

    if (configured) {
      await incrementCounter("posts", postId, "likes").catch(() => undefined);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Blogs & Cases"
        title="Share lessons learned from real incidents"
        description="Publish prevention writeups, post-mortems, or anonymized case stories that help others avoid the same trap."
      />
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Create a post</CardTitle>
            <CardDescription>
              Use `blog` for educational content and `case` for real scam narratives with takeaways.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              onChange={(event) =>
                setPostForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Title"
              value={postForm.title}
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  postForm.type === "blog"
                    ? "border-sky-500 bg-sky-500/10 text-slate-950 dark:text-white"
                    : "border-slate-200 dark:border-slate-800"
                }`}
                onClick={() => setPostForm((current) => ({ ...current, type: "blog" }))}
                type="button"
              >
                Blog
              </button>
              <button
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  postForm.type === "case"
                    ? "border-sky-500 bg-sky-500/10 text-slate-950 dark:text-white"
                    : "border-slate-200 dark:border-slate-800"
                }`}
                onClick={() => setPostForm((current) => ({ ...current, type: "case" }))}
                type="button"
              >
                Case sharing
              </button>
            </div>
            <Input
              onChange={(event) =>
                setPostForm((current) => ({ ...current, tags: event.target.value }))
              }
              placeholder="Tags, comma separated"
              value={postForm.tags}
            />
            <Textarea
              className="min-h-40"
              onChange={(event) =>
                setPostForm((current) => ({ ...current, content: event.target.value }))
              }
              placeholder="Share the core incident, warning signs, and what users should do differently."
              value={postForm.content}
            />
            <Button className="w-full" onClick={() => void handleCreatePost()}>
              <PenSquare className="h-4 w-4" />
              Publish post
            </Button>
            {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <EmptyState
              title="No posts yet"
              description="Start the knowledge base with a prevention article or a real case recap."
            />
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription className="mt-2">
                        By {post.authorName} · {formatRelativeDate(post.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant={post.type === "case" ? "warning" : "accent"}>
                      {post.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="neutral">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" onClick={() => void handleLike(post.id)}>
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </Button>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {post.commentCount} comments
                    </div>
                  </div>
                  <div className="space-y-3">
                    {(commentsByPost[post.id] || []).map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/50"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-slate-950 dark:text-white">
                            {comment.authorName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatRelativeDate(comment.createdAt)}
                          </p>
                        </div>
                        <p className="mt-2 leading-6 text-slate-700 dark:text-slate-200">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-[24px] border border-dashed border-slate-300/80 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <MessageCircleMore className="h-4 w-4" />
                      Add a comment
                    </div>
                    <Textarea
                      className="mt-3 min-h-24"
                      onChange={(event) =>
                        setCommentDrafts((current) => ({
                          ...current,
                          [post.id]: event.target.value,
                        }))
                      }
                      placeholder="Add a practical observation or follow-up question."
                      value={commentDrafts[post.id] ?? ""}
                    />
                    <Button className="mt-3" onClick={() => void handleComment(post.id)}>
                      Submit comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
