<?php

namespace App\Livewire;

use App\Models\User;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\Attributes\Layout;

#[Layout('layouts.app')]
class UserManagement extends Component
{
    use WithPagination;

    public $selectedUser = null;
    public $showRoleModal = false;
    public $isModerator = false;
    public $isAdmin = false;
    public $isActive = true;

    public function openRoleModal($userId)
    {
        $user = User::findOrFail($userId);
        $this->selectedUser = $user;
        $this->isModerator = $user->is_moderator;
        $this->isAdmin = $user->is_admin;
        $this->isActive = $user->is_active;
        $this->showRoleModal = true;
    }

    public function closeRoleModal()
    {
        $this->showRoleModal = false;
        $this->selectedUser = null;
        $this->isModerator = false;
        $this->isAdmin = false;
        $this->isActive = true;
    }

    public function updateRole()
    {
        $user = auth()->user();
        
        // Only admins can change roles
        if (!$user->isAdmin()) {
            session()->flash('error', 'You do not have permission to change user roles.');
            $this->closeRoleModal();
            return;
        }

        if (!$this->selectedUser) {
            return;
        }

        // Prevent admins from modifying themselves
        if ($this->selectedUser->id === $user->id) {
            session()->flash('error', 'You cannot modify your own role.');
            $this->closeRoleModal();
            return;
        }

        $this->selectedUser->update([
            'is_moderator' => $this->isModerator,
            'is_admin' => $this->isAdmin,
            'is_active' => $this->isActive,
        ]);

        session()->flash('success', "User '{$this->selectedUser->name}' role updated successfully.");
        $this->closeRoleModal();
    }

    public function deleteUser($userId)
    {
        $user = auth()->user();
        
        // Only admins can delete users
        if (!$user->isAdmin()) {
            session()->flash('error', 'You do not have permission to delete users.');
            return;
        }

        $targetUser = User::findOrFail($userId);

        // Prevent admins from deleting themselves
        if ($targetUser->id === $user->id) {
            session()->flash('error', 'You cannot delete your own account.');
            return;
        }

        $userName = $targetUser->name;
        $targetUser->delete();

        session()->flash('success', "User '{$userName}' deleted successfully.");
    }

    public function render()
    {
        $users = User::withCount(['reviews', 'ratings'])
            ->latest()
            ->paginate(20);

        return view('livewire.user-management', [
            'users' => $users,
        ]);
    }
}
