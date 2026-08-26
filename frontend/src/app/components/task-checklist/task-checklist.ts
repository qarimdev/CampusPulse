import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface StudentTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-task-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-checklist.html',
  styleUrl: './task-checklist.scss',
})
export class TaskChecklistComponent implements OnInit {
  tasks = signal<StudentTask[]>([]);
  newTaskTitle = signal<string>('');
  newTaskPriority = signal<'high' | 'medium' | 'low'>('medium');

  completedCount = computed(() => this.tasks().filter((t) => t.completed).length);
  totalCount = computed(() => this.tasks().length);

  ngOnInit(): void {
    const saved = localStorage.getItem('student_tasks');
    if (saved) {
      try {
        this.tasks.set(JSON.parse(saved));
      } catch (e) {
        this.initDefaultTasks();
      }
    } else {
      this.initDefaultTasks();
    }
  }

  private initDefaultTasks(): void {
    const defaults: StudentTask[] = [
      { id: '1', title: 'Submit CS101 Assignment 2', completed: false, priority: 'high' },
      { id: '2', title: 'Review Database Lecture Notes', completed: true, priority: 'medium' },
    ];
    this.tasks.set(defaults);
    this.save();
  }

  addTask(): void {
    const title = this.newTaskTitle().trim();
    if (!title) return;

    const newTask: StudentTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority: this.newTaskPriority(),
    };

    this.tasks.update((list) => [...list, newTask]);
    this.newTaskTitle.set('');
    this.save();
  }

  toggleTask(id: string): void {
    this.tasks.update((list) =>
      list.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
    this.save();
  }

  deleteTask(id: string): void {
    this.tasks.update((list) => list.filter((task) => task.id !== id));
    this.save();
  }

  private save(): void {
    localStorage.setItem('student_tasks', JSON.stringify(this.tasks()));
  }
}
