export type TaskStatusType = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriorityType = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type FrogDifficultyType = "EASY" | "MEDIUM" | "HARD";

export interface CalendarApproachParams {
  eventId: string | null;
  isAllDay: boolean;
  recurrenceRule: string | null;
}

export interface GtdApproachParams {
  context: string | null;
  nextAction: boolean;
  projectLink: string | null;
  waitingFor: string | null;
}

export interface EisenhowerApproachParams {
  urgency: number;
  importance: number;
}

export interface FrogApproachParams {
  isFrog: boolean;
  difficulty: FrogDifficultyType;
}

export interface TaskDocument {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatusType;
  priority: TaskPriorityType;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  creatorUid: string;
  assigneeUid: string | null;
  workspaceId: string;
  tags: string[];
  pomodoroEstimatedCycles: number | null;
  pomodoroEstimatedMinutes: number | null;
  approachParams: {
    calendar?: CalendarApproachParams;
    gtd?: GtdApproachParams;
    eisenhower?: EisenhowerApproachParams;
    frog?: FrogApproachParams;
  } | null;
  orderInList: number;
  localId: string | null;
}

export interface CreateTaskPayload {
  title: string;
  description?: string | null;
  priority?: TaskPriorityType;
  dueDate?: string | null;
  workspaceId: string;
  assigneeUid?: string | null;
  tags?: string[];
  pomodoroEstimatedCycles?: number | null;
  pomodoroEstimatedMinutes?: number | null;
  approachParams?: {
    calendar?: CalendarApproachParams;
    gtd?: GtdApproachParams;
    eisenhower?: EisenhowerApproachParams;
    frog?: FrogApproachParams;
  } | null;
  orderInList?: number;
}

export interface UpdateTaskPayload {
  taskId: string;
  title?: string;
  description?: string | null;
  status?: TaskStatusType;
  priority?: TaskPriorityType;
  dueDate?: string | null;
  assigneeUid?: string | null;
  tags?: string[];
  pomodoroEstimatedCycles?: number | null;
  pomodoroEstimatedMinutes?: number | null;
  approachParams?: {
    calendar?: CalendarApproachParams;
    gtd?: GtdApproachParams;
    eisenhower?: EisenhowerApproachParams;
    frog?: FrogApproachParams;
  } | null;
  orderInList?: number;
}

export interface SubtaskDocument {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: string;
}

export interface CommentDocument {
  id: string;
  authorUid: string;
  authorName: string;
  authorAvatarUrl: string | null;
  text: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetTasksResponse {
  tasks: TaskDocument[];
}

export interface CreateTaskResponse {
  task: TaskDocument;
}

export interface UpdateTaskResponse {
  success: boolean;
  task: TaskDocument;
}

export interface DeleteTaskResponse {
  success: boolean;
  message: string;
}

export interface TaskFilters {
  status?: TaskStatusType[];
  priority?: TaskPriorityType[];
  tagsInclude?: string[];
  tagsExclude?: string[];
  assignee?: "me" | "unassigned" | string | null;
  search?: string;
  dueDateRange?: {
    start: string | null;
    end: string | null;
  } | null;
}

export interface TaskSortOptions {
  field: "title" | "priority" | "dueDate" | "createdAt" | "updatedAt" | "status" | "orderInList";
  direction: "asc" | "desc";
}
