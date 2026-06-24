export interface Course {
  id: string;
  name: string;
  department: string;
  credits: number;
  description: string;
  prerequisites: string[];
  schedule: string;
  instructor: string;
  capacity: number;
  enrolled: number;
}
