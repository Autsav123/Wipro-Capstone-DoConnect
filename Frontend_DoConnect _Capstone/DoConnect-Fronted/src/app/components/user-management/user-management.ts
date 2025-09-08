import { Component,OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedFilter = 'all';
  selectedUsers: number[] = [];
  processingUsers = new Set<number>();
  bulkProcessing = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      this.filterUsers();
    });
  }

  filterUsers() {
    switch (this.selectedFilter) {
      case 'pending':
        this.filteredUsers = this.users.filter(u => u.status !== 'approved' && u.status !== 'rejected');
        break;
      case 'approved':
        this.filteredUsers = this.users.filter(u => u.status === 'approved');
        break;
      case 'rejected':
        this.filteredUsers = this.users.filter(u => u.status === 'rejected');
        break;
      default:
        this.filteredUsers = [...this.users];
    }
  }

  getPendingUsers(): number {
    return this.users.filter(u => u.status !== 'approved' && u.status !== 'rejected').length;
  }

  getApprovedUsers(): number {
    return this.users.filter(u => u.status === 'approved').length;
  }

  getRejectedUsers(): number {
    return this.users.filter(u => u.status === 'rejected').length;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      default:
        return 'badge-warning';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  }

  approveUser(userId: number) {
    this.processingUsers.add(userId);
    this.userService.approveUser(userId).subscribe({
      next: () => {
        this.processingUsers.delete(userId);
        this.loadUsers();
      },
      error: () => {
        this.processingUsers.delete(userId);
        console.error('Failed to approve user');
      }
    });
  }

  rejectUser(userId: number) {
    this.processingUsers.add(userId);
    this.userService.rejectUser(userId).subscribe({
      next: () => {
        this.processingUsers.delete(userId);
        this.loadUsers();
      },
      error: () => {
        this.processingUsers.delete(userId);
        console.error('Failed to reject user');
      }
    });
  }

  toggleUserSelection(userId: number) {
    const index = this.selectedUsers.indexOf(userId);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(userId);
    }
  }

  bulkApprove() {
    this.bulkProcessing = true;
    let completed = 0;
    const total = this.selectedUsers.length;

    this.selectedUsers.forEach(userId => {
      this.userService.approveUser(userId).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.bulkProcessing = false;
            this.selectedUsers = [];
            this.loadUsers();
          }
        },
        error: () => {
          completed++;
          console.error('Failed to approve user:', userId);
          if (completed === total) {
            this.bulkProcessing = false;
            this.selectedUsers = [];
            this.loadUsers();
          }
        }
      });
    });
  }

  bulkReject() {
    this.bulkProcessing = true;
    let completed = 0;
    const total = this.selectedUsers.length;

    this.selectedUsers.forEach(userId => {
      this.userService.rejectUser(userId).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.bulkProcessing = false;
            this.selectedUsers = [];
            this.loadUsers();
          }
        },
        error: () => {
          completed++;
          console.error('Failed to reject user:', userId);
          if (completed === total) {
            this.bulkProcessing = false;
            this.selectedUsers = [];
            this.loadUsers();
          }
        }
      });
    });
  }

  clearSelection() {
    this.selectedUsers = [];
  }
}


