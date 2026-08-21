export interface Course {
  name: string;
  code: string;
  teacher: string;
  progress: number;
}

export interface ScheduleItem {
  time: string;
  title: string;
  type: string;
  room: string;
}

export interface Task {
  title: string;
  due: string;
  priority: string;
}

export interface UserProfile {
  name?: string;
  role?: string;
  gpa: number;
  attendance: number;
  assignmentsDue: number;
  courses: Course[];
  schedule: ScheduleItem[];
  tasks: Task[];
}
