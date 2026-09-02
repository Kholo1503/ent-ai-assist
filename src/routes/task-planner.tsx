import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiOutput, Card, GhostButton, PrimaryButton } from "@/components/AiPanel";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { tasksAsText, useTasks } from "@/lib/tasks";
import { aiComplete } from "@/lib/ai.functions";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Easy Note Taker (ENT)" },
      {
        name: "description",
        content:
          "Let AI prioritise your tasks and build realistic daily and weekly schedules with time allocations.",
      },
      { property: "og:title", content: "AI Task Planner — ENT" },
      {
        property: "og:description",
        content: "Daily and weekly planners generated from your real task list.",
      },
    ],
  }),
  component: TaskPlanner;
});

function TaskPlanner() {
  return null;
}
