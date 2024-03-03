import KanbanColumnSkeleton from "@/components/layout/skeleton/kanban";
import ProjectCardSkeleton from "@/components/layout/skeleton/project-card";
import { KanbanAddCardButton } from "@/components/tasks/kanban/add-card-button";
import {
  KanbanBoard,
  KanbanBoardContainer,
} from "@/components/tasks/kanban/board";
import ProjectCard, { ProjectCardMemo } from "@/components/tasks/kanban/card";
import KanbanColumn from "@/components/tasks/kanban/column";
import KanbanItem from "@/components/tasks/kanban/item";
import { UPDATE_TASK_MUTATION } from "@/graphql/mutation";
import { TASKS_QUERY, TASK_STAGES_QUERY } from "@/graphql/queries";
import { Task, TaskStage } from "@/graphql/schema.types";
import { TasksQuery } from "@/graphql/types";
import { DragEndEvent } from "@dnd-kit/core";
import { useList, useNavigation, useUpdate } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import React, { FC } from "react";

type Props = {
  children?: React.ReactNode;
};

const List: FC<Props> = ({ children }) => {
  const { replace } = useNavigation();
  const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
    resource: "taskStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["TODO", "IN_PROGRESS", "DONE", "IN REVIEW"],
      },
    ],
    meta: {
      gqlQuery: TASK_STAGES_QUERY,
    },
    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],
  });
  const { data: tasks, isLoading: isLoadingTasks } = useList<
    GetFieldsFromList<TasksQuery>
  >({
    resource: "tasks",
    sorters: [
      {
        field: "dueDate",
        order: "asc",
      },
    ],
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: TASKS_QUERY,
    },
    queryOptions: {
      enabled: !!stages,
    },
  });
  const taskStages = React.useMemo(() => {
    if (stages && tasks) {
      const unasignedStage = tasks.data?.filter(
        (task) => task.stageId === null
      );
      const grouped: TaskStage[] = stages.data.map((stage) => {
        const tasksInStage = tasks.data?.filter(
          (task) => task.stageId == stage.id
        );
        return {
          ...stage,
          tasks: tasksInStage,
        };
      });
      return { unasignedStage, stages: grouped };
    }
    return { unasignedStage: [], stages: [] };
  }, [stages, tasks]);

  const { mutate: updateTask } = useUpdate<Task>();

  const handleAddCard = (args: { stageId: string }) => {
    const path =
      args.stageId == "unassigned"
        ? "/tasks/new"
        : `tasks/new?stageId=${args.stageId}`;
    replace(path);
  };

  const handleOnDragEnd = (event: DragEndEvent) => {
    let stageId = event.over?.id as undefined | string | null;
    const taskId = event.active.id as string;
    const taskStageId = event.active.data.current.stageId;
    if (taskId == stageId) return;
    if (stageId === "unassigned") {
      stageId = null;
    }
    updateTask({
      resource: "tasks",
      id: taskId,
      values: {
        stageId: stageId,
      },
      successNotification: false,
      mutationMode: "optimistic",
      meta: {
        gqlMutation: UPDATE_TASK_MUTATION,
      },
    });
  };

  const isLoading = isLoadingStages || isLoadingTasks;

  if (isLoading) {
    return <PageSkeleton />;
  }
  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          <KanbanColumn
            id="unassigned"
            title={"unassigned"}
            count={taskStages.unasignedStage.length || 0}
            onAddClick={() => {
              handleAddCard({ stageId: "unassigned" });
            }}
          >
            {taskStages.unasignedStage.map((task) => (
              <KanbanItem
                id={task.id}
                data={{ ...task, stageId: "unassigned" }}
                key={task.id}
              >
                <ProjectCardMemo
                  {...task}
                  dueDate={task.dueDate || undefined}
                />
              </KanbanItem>
            ))}
            {!taskStages.unasignedStage.length && (
              <KanbanAddCardButton
                onClick={() => handleAddCard({ stageId: "unassigned" })}
              />
            )}
          </KanbanColumn>
          {taskStages.stages.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={column.tasks?.length || 0}
              onAddClick={() => {
                handleAddCard({ stageId: column.id });
              }}
            >
              {!isLoading &&
                column.tasks?.map((task) => (
                  <KanbanItem data={task} key={task.id} id={task.id}>
                    <ProjectCardMemo
                      {...task}
                      dueDate={task.dueDate || undefined}
                    />
                  </KanbanItem>
                ))}
              {!column.tasks?.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: column.id })}
                />
              )}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>
      {children}
    </>
  );
};

export default List;

const PageSkeleton = () => {
  const columnCount = 6;
  const itemCount = 4;

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, index) => (
        <KanbanBoard key={index}>
          <KanbanColumnSkeleton />
          {Array.from({ length: itemCount }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </KanbanBoard>
      ))}
    </KanbanBoardContainer>
  );
};
