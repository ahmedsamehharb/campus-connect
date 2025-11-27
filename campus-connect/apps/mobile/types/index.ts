// =============================================
// DATABASE TYPES
// =============================================

export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  student_id?: string;
  major?: string;
  minor?: string;
  year?: string;
  enrollment_date?: string;
  expected_graduation?: string;
  gpa?: number;
  total_credits?: number;
  advisor?: string;
  phone?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  professor: string;
  professor_rating: number;
  credits: number;
  description?: string;
  prerequisites?: string[];
  difficulty: number;
  capacity: number;
  semester: string;
  category: string;
  schedules?: CourseSchedule[];
  enrolled_count?: number;
}

export interface CourseSchedule {
  id: string;
  course_id: string;
  day: string;
  time: string;
  location: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  grade?: string;
  grade_points?: number;
  course?: Course;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  due_date: string;
  due_time: string;
  max_grade: number;
  weight: number;
  type: string;
  estimated_time?: number;
  course?: Course;
  submission?: AssignmentSubmission;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  user_id: string;
  status: string;
  grade?: number;
  submitted_at?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  category: string;
  max_attendees: number;
  organizer?: string;
  image_url?: string;
  attendee_count?: number;
  is_attending?: boolean;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  likes: number;
  created_at: string;
  author?: Profile;
  reply_count?: number;
  is_liked?: boolean;
}

export interface PostReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: Profile;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  description?: string;
  status: string;
  category?: string;
  created_at: string;
}

export interface FinancialSummary {
  id: string;
  user_id: string;
  tuition_balance: number;
  tuition_due?: string;
  meal_plan_balance: number;
  printing_credits: number;
  campus_card_balance: number;
  scholarships: number;
  financial_aid: number;
  monthly_budget: number;
}

export interface StudyRoom {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  noise_level: string;
  equipment?: string[];
  amenities?: string[];
  current_occupancy?: number;
  is_available?: boolean;
  next_available?: string;
}

export interface RoomBooking {
  id: string;
  room_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  status: string;
  room?: StudyRoom;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  location?: string;
  salary?: string;
  description?: string;
  requirements?: string[];
  posted_date: string;
  deadline?: string;
  is_saved?: boolean;
  is_applied?: boolean;
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  status: string;
  applied_at: string;
  job?: Job;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  points: number;
  max_progress?: number;
  user_progress?: number;
  unlocked?: boolean;
  unlocked_at?: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_points: number;
  level: number;
  streak: number;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'course';
  name?: string;
  created_at: string;
  participants?: Profile[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: number;
  note?: string;
  created_at: string;
}

export interface SleepEntry {
  id: string;
  user_id: string;
  hours: number;
  date: string;
}

// =============================================
// APP-SPECIFIC TYPES
// =============================================

export interface SearchResults {
  courses: Pick<Course, 'id' | 'code' | 'name' | 'professor'>[];
  events: Pick<Event, 'id' | 'title' | 'date' | 'location'>[];
  jobs: Pick<Job, 'id' | 'title' | 'company' | 'type'>[];
  faqs: Pick<FAQ, 'id' | 'question' | 'category'>[];
}

export type FeatureCategory =
  | 'academics'
  | 'financial'
  | 'dining'
  | 'transport'
  | 'study'
  | 'ai'
  | 'messages'
  | 'career'
  | 'wellness'
  | 'achievements'
  | 'events'
  | 'community'
  | 'notifications'
  | 'search';

export interface QuickAccessItem {
  id: FeatureCategory;
  title: string;
  icon: string;
  route: string;
  color: string;
  description?: string;
}








