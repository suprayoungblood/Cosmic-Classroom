import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Card, 
  CardBody, 
  Spinner, 
  Alert, 
  Tabs, 
  TabsHeader, 
  Tab,
  Button,
  Input,
  Select,
  Option
} from "@material-tailwind/react";
import { useAuth } from "../contexts/AuthContext";
import PageTitle from "../widgets/layout/page-title";
import { 
  UserGroupIcon, 
  KeyIcon, 
  ShieldCheckIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [editingUserId, setEditingUserId] = useState(null);
  const { user } = useAuth();

  // Demo data for users in the system
  const [users, setUsers] = useState([
    { id: 1, username: "space_explorer", email: "student@cosmiclassroom.com", firstName: "Student", lastName: "User", role: "student", status: "active", joinDate: "2023-10-15" },
    { id: 2, username: "space_teacher", email: "educator@cosmiclassroom.com", firstName: "Educator", lastName: "User", role: "educator", status: "active", joinDate: "2023-09-20" },
    { id: 3, username: "space_admin", email: "admin@cosmiclassroom.com", firstName: "Admin", lastName: "User", role: "admin", status: "active", joinDate: "2023-08-01" },
    { id: 4, username: "cosmic_student", email: "alex@example.com", firstName: "Alex", lastName: "Johnson", role: "student", status: "active", joinDate: "2023-11-05" },
    { id: 5, username: "stargazer", email: "maria@example.com", firstName: "Maria", lastName: "Garcia", role: "student", status: "inactive", joinDate: "2023-10-30" },
    { id: 6, username: "science_teacher", email: "james@example.com", firstName: "James", lastName: "Smith", role: "educator", status: "active", joinDate: "2023-09-15" },
    { id: 7, username: "galaxy_viewer", email: "sarah@example.com", firstName: "Sarah", lastName: "Wilson", role: "student", status: "active", joinDate: "2023-11-12" }
  ]);

  // Demo data for roles and permissions
  const [roles, setRoles] = useState([
    { id: 1, name: "student", description: "Regular user who can ask questions and view their history", permissions: ["ask_questions", "view_own_history", "view_learning_materials"] },
    { id: 2, name: "educator", description: "Teachers who can view analytics and class performance", permissions: ["ask_questions", "view_own_history", "view_analytics", "view_student_activity", "create_learning_materials"] },
    { id: 3, name: "admin", description: "System administrators with all privileges", permissions: ["ask_questions", "view_own_history", "view_analytics", "view_student_activity", "create_learning_materials", "manage_users", "manage_roles", "system_settings"] }
  ]);

  // Demo data for system logs
  const [systemLogs, setSystemLogs] = useState([
    { id: 1, action: "User Login", user: "admin@cosmiclassroom.com", details: "Admin user logged in", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, action: "Role Update", user: "admin@cosmiclassroom.com", details: "Updated permissions for 'educator' role", timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, action: "User Creation", user: "admin@cosmiclassroom.com", details: "Created new user 'galaxy_viewer'", timestamp: new Date(Date.now() - 172800000).toISOString() },
    { id: 4, action: "System Setting", user: "admin@cosmiclassroom.com", details: "Updated rate limiting settings", timestamp: new Date(Date.now() - 259200000).toISOString() },
    { id: 5, action: "User Status", user: "admin@cosmiclassroom.com", details: "Set 'stargazer' to inactive", timestamp: new Date(Date.now() - 345600000).toISOString() }
  ]);

  // Form for editing user
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    status: ""
  });

  useEffect(() => {
    // Simulate API call to get admin data
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, we would fetch data from API:
        // const response = await fetch('/api/admin/users');
        // const data = await response.json();
        // setUsers(data.users);
        // setRoles(data.roles);
        // setSystemLogs(data.logs);
        
        // Using demo data from state instead
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load administration data. Please try again later.");
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle edit user
  const handleEditUser = (userId) => {
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit) {
      setEditForm({
        firstName: userToEdit.firstName,
        lastName: userToEdit.lastName,
        email: userToEdit.email,
        role: userToEdit.role,
        status: userToEdit.status
      });
      setEditingUserId(userId);
    }
  };

  // Handle save user changes
  const handleSaveUser = () => {
    if (!editingUserId) return;
    
    setUsers(users.map(user => {
      if (user.id === editingUserId) {
        return { ...user, ...editForm };
      }
      return user;
    }));
    
    // Add log entry for the edit
    const editedUser = users.find(u => u.id === editingUserId);
    setSystemLogs([
      {
        id: systemLogs.length + 1,
        action: "User Update",
        user: `${user?.email || 'admin@cosmiclassroom.com'}`,
        details: `Updated user '${editedUser?.username}'`,
        timestamp: new Date().toISOString()
      },
      ...systemLogs
    ]);
    
    setEditingUserId(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  return (
    <div className="min-h-screen bg-cosmic-background text-cosmic-text pb-20">
      <PageTitle heading="Administration Dashboard" />
      
      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert color="red" className="mb-6">
            {error}
          </Alert>
        )}
        
        <div className="mb-8">
          <Typography variant="lead" className="text-cosmic-text-secondary">
            Manage users, roles, and system settings.
          </Typography>
        </div>
        
        <Tabs value={activeTab} className="mb-8">
          <TabsHeader className="bg-cosmic-card-bg/50 border-cosmic-border">
            <Tab 
              value="users" 
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 ${activeTab === "users" ? "text-cosmic-primary" : ""}`}
            >
              <div className="flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5" />
                Users
              </div>
            </Tab>
            <Tab 
              value="roles" 
              onClick={() => setActiveTab("roles")}
              className={`px-6 py-3 ${activeTab === "roles" ? "text-cosmic-primary" : ""}`}
            >
              <div className="flex items-center gap-2">
                <KeyIcon className="w-5 h-5" />
                Roles
              </div>
            </Tab>
            <Tab 
              value="logs" 
              onClick={() => setActiveTab("logs")}
              className={`px-6 py-3 ${activeTab === "logs" ? "text-cosmic-primary" : ""}`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                Logs
              </div>
            </Tab>
          </TabsHeader>
        </Tabs>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner className="h-12 w-12 text-cosmic-primary" />
          </div>
        ) : (
          <>
            {activeTab === "users" && (
              <Card className="bg-cosmic-card-bg/80 border border-cosmic-border w-full">
                <CardBody>
                  <div className="flex justify-between items-center mb-6">
                    <Typography variant="h5">
                      User Management
                    </Typography>
                    
                    <Button 
                      size="sm"
                      className="flex items-center gap-2 bg-cosmic-primary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add New User
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Name
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Username
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Email
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Role
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Status
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Joined
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Actions
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user.id} className={index % 2 === 0 ? "bg-cosmic-background/10" : ""}>
                            {editingUserId === user.id ? (
                              // Edit mode
                              <>
                                <td className="p-4" colSpan={5}>
                                  <div className="grid grid-cols-2 gap-3">
                                    <Input
                                      label="First Name"
                                      value={editForm.firstName}
                                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                                      className="cosmic-input"
                                    />
                                    <Input
                                      label="Last Name"
                                      value={editForm.lastName}
                                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                                      className="cosmic-input"
                                    />
                                    <Input
                                      label="Email"
                                      value={editForm.email}
                                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                      className="cosmic-input"
                                    />
                                    <Select
                                      label="Role"
                                      value={editForm.role}
                                      onChange={(val) => setEditForm({...editForm, role: val})}
                                      className="cosmic-input"
                                    >
                                      <Option value="student">Student</Option>
                                      <Option value="educator">Educator</Option>
                                      <Option value="admin">Admin</Option>
                                    </Select>
                                    <Select
                                      label="Status"
                                      value={editForm.status}
                                      onChange={(val) => setEditForm({...editForm, status: val})}
                                      className="cosmic-input"
                                    >
                                      <Option value="active">Active</Option>
                                      <Option value="inactive">Inactive</Option>
                                    </Select>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Typography variant="small" className="text-cosmic-text-secondary">
                                    {user.joinDate}
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      className="p-2 bg-green-500"
                                      onClick={handleSaveUser}
                                    >
                                      <CheckIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="p-2 bg-red-500"
                                      onClick={handleCancelEdit}
                                    >
                                      <XMarkIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              // View mode
                              <>
                                <td className="p-4">
                                  <Typography variant="small" className="font-medium text-white">
                                    {user.firstName} {user.lastName}
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <Typography variant="small" className="text-white">
                                    {user.username}
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <Typography variant="small" className="text-white">
                                    {user.email}
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <div className={`px-2 py-1 rounded text-xs text-white inline-block ${
                                    user.role === 'admin' ? 'bg-red-500' : 
                                    user.role === 'educator' ? 'bg-cosmic-primary' : 
                                    'bg-cosmic-secondary'
                                  }`}>
                                    {user.role}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className={`px-2 py-1 rounded text-xs text-white inline-block ${
                                    user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                                  }`}>
                                    {user.status}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Typography variant="small" className="text-gray-300">
                                    {user.joinDate}
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      className="p-2 bg-cosmic-primary"
                                      onClick={() => handleEditUser(user.id)}
                                    >
                                      <PencilSquareIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="p-2 bg-red-500"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            )}
            
            {activeTab === "roles" && (
              <div className="grid grid-cols-1 gap-6">
                {roles.map((role) => (
                  <Card key={role.id} className="bg-cosmic-card-bg/80 border border-cosmic-border">
                    <CardBody>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              role.name === 'admin' ? 'bg-red-500' : 
                              role.name === 'educator' ? 'bg-cosmic-primary' : 
                              'bg-cosmic-secondary'
                            }`}></div>
                            <Typography variant="h5" className="font-medium">
                              {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                            </Typography>
                          </div>
                          <Typography className="text-cosmic-text-secondary mt-1">
                            {role.description}
                          </Typography>
                        </div>
                        
                        <Button 
                          size="sm"
                          className="flex items-center gap-2 bg-cosmic-primary"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                          Edit Role
                        </Button>
                      </div>
                      
                      <div className="mt-4">
                        <Typography variant="small" className="font-medium text-cosmic-text-secondary mb-2">
                          Permissions:
                        </Typography>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map((permission) => (
                            <div key={permission} className="px-3 py-1 bg-cosmic-background/50 border border-cosmic-border/50 rounded-full text-xs">
                              {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
            
            {activeTab === "logs" && (
              <Card className="bg-cosmic-card-bg/80 border border-cosmic-border w-full">
                <CardBody>
                  <Typography variant="h5" className="mb-6">
                    System Activity Logs
                  </Typography>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Action
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              User
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Details
                            </Typography>
                          </th>
                          <th className="p-4 border-b border-cosmic-border bg-cosmic-background/30">
                            <Typography variant="small" className="font-medium text-cosmic-text-secondary">
                              Timestamp
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {systemLogs.map((log, index) => (
                          <tr key={log.id} className={index % 2 === 0 ? "bg-cosmic-background/10" : ""}>
                            <td className="p-4">
                              <Typography variant="small" className="font-medium text-white">
                                {log.action}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" className="text-white">
                                {log.user}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" className="text-white">
                                {log.details}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" className="text-gray-300">
                                {formatDate(log.timestamp)}
                              </Typography>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;