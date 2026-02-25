
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Student, SystemSettings, AuditLog, StudentStatus, Gender, StaffUser, RolePermissions, SessionConfig, ValidationStatus
} from './types';

interface Notification {
  message: string;
  type: 'success' | 'error';
}

interface AppContextType {
  students: Student[];
  degrees: string[];
  departments: string[];
  programmes: string[];
  faculty: string[];
  settings: SystemSettings;
  auditLogs: AuditLog[];
  staff: StaffUser[];
  sessions: SessionConfig[];
  currentUser: string | null;
  currentRole: RolePermissions | null;
  notification: Notification | null;
  notify: (message: string, type: 'success' | 'error') => void;
  login: (user: string) => void;
  logout: () => void;
  addStudent: (student: Omit<Student, 'id' | 'isLocked' | 'srNo'>) => void;
  bulkAddStudents: (newStudents: Omit<Student, 'id' | 'isLocked' | 'srNo'>[]) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  toggleLockStudent: (id: string) => void;
  updateSettings: (settings: SystemSettings) => void;
  logAction: (action: string, details: string) => void;
  addStaff: (user: Omit<StaffUser, 'id'>) => void;
  updateStaff: (user: StaffUser) => void;
  deleteStaff: (id: string) => void;
  addSession: (session: SessionConfig) => void;
  backupDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const FACULTY_DATABASE = [
  "Dr. Haseeb Khaliq", "Mr. Muhammad Sajid", "Mr. Muhammad Usman", "Dr. Muhammad Rafiq", "Dr. Jawaria Aslam", 
  "Dr. Khurruam Shehzad", "Dr. Yasir Waqas", "Dr. Yasmin", "Dr. Muhammad Yar", "Dr. Shaukat Hussain Munawar", 
  "Dr. Zahid Manzoor", "Dr. Kashif Akram", "Dr. Hamid Majeed", "Dr. Tahir Mahmood Qureshi", "Dr. Afshan Shafi", 
  "Dr. Sheraz Ahmed", "Dr. Abdul Ghaffar", "Dr. S Qaswar Ali Shah", "Dr. Huma Naz", "Dr. Irfan Baboo", 
  "Dr. Zahid Farooq", "Dr. Santosh Kumar", "Dr. Adnan A Qazi", "Dr. M. Tariq Mahmood", "Ms. Tayyaba Riaz", 
  "Ms. Mutyyba Asghar", "Mr. Muhammad Atif Noor", "Mr. Muhammad Umer Farooq", "Dr. Nasir Jalal", "Dr. Asim Masood", 
  "Dr. Waheed Yousuf Ramay", "Dr. Zulqarnain", "Dr. Rana Muhammad Bilal", "Dr. Asif Javaid", "Dr. Imtiaz Hussain Raja", 
  "Dr. Muhammad Uzair Akhtar", "Dr. Umair Younas", "Dr. Zeeshan M. Iqbal", "Dr. Muhammad Nauman", "Mr. Rameez Abid", 
  "Mr. Sannan Nazir", "Mr. Muhammad Arslan", "Dr. Muhammad Tahir Khan", "Mr. Muhammad Azhar", "Ms. Tahreem Asad", 
  "Dr. Muhammad Safdar", "Miss Humaira Amin", "Dr. M. Azhar", "Dr. Arslan Sehgal", "Dr. Faiz-ul Hassan", 
  "Dr. Hafiz Ifhtikhar Hussain", "Dr. Mujahid Iqbal", "Dr. Rizwana Sultan", "Dr. Mubasher Rauf", "Prof. Dr. Muhammad Mazhar Ayaz", 
  "Dr. Wasim Babar", "Dr. Abdullah Saghir Ahmad", "Dr. Muhammad Adeel Hassan", "Dr. Jamal Muhammad Khan", "Dr. Faisal Siddique", 
  "Dr. Rais Ahmed", "Dr. Moazam Jalees", "Dr. Waqas Ashraf", "Dr. Firasat Hussain", "Dr. Qudratullah Mehsud", 
  "Dr. Fazal Wadood", "Dr. Muhammad Luqman Sohail", "Dr. Kashif Hussain", "Dr. Amjad Islam Aqib", "Dr. Omer Naseer", 
  "Dr. Kashif Prince", "Dr. Qudratullah", "Dr. Muhammad Shahid", "Dr. Ameer Hamza Rabbani", "Dr. Tariq Abbas", 
  "Dr. Muhammad Naeem Shahid", "Dr. Saleh Nawaz Khan", "Dr. Muhammad Ajmal", "Dr. Mushtaq Ahmad Gondal", "Dr. Muhammad Kasif Iqbal", 
  "Mr. Muhammad Kaleem", "Dr. Hanzla Ahmad", "Ms. Rimsha Hamid", "Ms. Samavia Shaheen", "Ms. Qurat-Ul-Ain Mumtaz", 
  "Ms. Shariha Sohail", "Ms. Iqra Naeem", "Dr. Inam Ullah Wattoo", "Dr. Khawaja Saif Ur Rehman", "Dr. Tanveer Akhtar", 
  "Dr. Samina Anjum", "Dr. Abdul Khaliq", "Mr. Muhammad Kamal", "Miss Aisha Kabir", "Mr. Zaib Hassan Niazi", 
  "Mr. Rao Basharat Ali", "Dr. Humera Hayat", "Mr. Shafaqat Ali"
];

const INITIAL_SETTINGS: SystemSettings = {
  institution: {
    name: "Cholistan University of Veterinary & Animal Sciences, Bahawalpur",
    directorate: "Directorate of Advanced Studies",
    systemName: "PDMS-PRO v4.0",
    email: "das@cuvas.edu.pk",
    contact: "+92-62-9255711",
    academicYear: "2025-26",
    admissionSession: "Spring 2026",
    logo: "",
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableRecordLocking: true,
    enableDeletion: false,
  },
  maintenance: {
    version: "4.0.0-PRO",
    lastBackup: "2025-05-25 11:30 AM",
  },
  defaultSemesterDurationWeeks: 18,
};

const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1', srNo: '001', cnic: '31202-1111111-1', name: 'Ahmad Khan', fatherName: 'Nasir Khan', regNo: '2024-CUVAS-001',
    gender: Gender.MALE, contactNumber: '0300-1112223',
    degree: 'PhD', session: 'Fall 2024', department: 'Animal Nutrition', programme: 'PhD Animal Nutrition',
    currentSemester: 3, status: StudentStatus.ACTIVE, supervisorName: 'Dr. Haseeb Khaliq', coSupervisor: 'Dr. Nasir Ali',
    member1: 'Dr. Muhammad Rafiq', member2: 'Dr. Jawaria Aslam',
    thesisId: 'T-AN-2024-01',
    synopsis: 'Not Submitted', synopsisSubmissionDate: '', gs2CourseWork: 'Completed', gs4Form: 'Not Submitted',
    semiFinalThesisStatus: 'Not Submitted', semiFinalThesisSubmissionDate: '',
    finalThesisStatus: 'Not Submitted', finalThesisSubmissionDate: '', thesisSentToCOE: 'No', coeSubmissionDate: '',
    validationStatus: ValidationStatus.PENDING, validationDate: '', comments: 'Excellent progress.', isLocked: false
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('das_students_v4.0');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('das_settings_v4.0');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => JSON.parse(localStorage.getItem('das_audit_v4.0') || '[]'));
  const [currentUser, setCurrentUser] = useState<string | null>(localStorage.getItem('das_user'));
  const [notification, setNotification] = useState<Notification | null>(null);
  
  const [staff, setStaff] = useState<StaffUser[]>(() => {
    const saved = localStorage.getItem('das_staff_v4.0');
    return saved ? JSON.parse(saved) : [
      { id: 'u1', username: 'admin', name: 'Primary Admin', role: 'System Administrator', lastLogin: '2025-05-25 09:00 AM' }
    ];
  });

  const [sessions, setSessions] = useState<SessionConfig[]>(() => JSON.parse(localStorage.getItem('das_sessions_v4.0') || '[]'));

  useEffect(() => localStorage.setItem('das_students_v4.0', JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem('das_settings_v4.0', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('das_audit_v4.0', JSON.stringify(auditLogs)), [auditLogs]);
  useEffect(() => localStorage.setItem('das_staff_v4.0', JSON.stringify(staff)), [staff]);
  useEffect(() => localStorage.setItem('das_sessions_v4.0', JSON.stringify(sessions)), [sessions]);

  const notify = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const login = (user: string) => {
    setCurrentUser(user);
    localStorage.setItem('das_user', user);
    logAction('Access', `${user} logged into the system.`);
    notify(`Welcome back, ${user}. Access granted.`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('das_user');
    notify('Secure logout successful.', 'success');
  };

  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: 'L' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      timestamp: new Date().toISOString(),
      user: currentUser || 'System',
      action,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 1000));
  };

  const addStudent = (data: any) => {
    const newStudent: Student = {
      ...data,
      id: 's' + Math.random().toString(36).substr(2, 5),
      srNo: (students.length + 1).toString().padStart(3, '0'),
      isLocked: false
    };
    setStudents(prev => [...prev, newStudent]);
    logAction('Registration', `Enrolled: ${newStudent.name}`);
    notify(`Scholar ${newStudent.name} provisioned successfully.`, 'success');
  };

  const bulkAddStudents = (newStudentsData: any[]) => {
    const startSr = students.length + 1;
    const processed = newStudentsData.map((data, index) => ({
      ...data,
      id: 's' + Math.random().toString(36).substr(2, 8),
      srNo: (startSr + index).toString().padStart(3, '0'),
      isLocked: false,
      currentSemester: parseInt(data.currentSemester) || 1
    }));
    
    setStudents(prev => [...prev, ...processed]);
    logAction('Bulk Upload', `Added ${processed.length} records via CSV.`);
    notify(`${processed.length} scholar records integrated into registry.`, 'success');
  };

  const updateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    logAction('Records', `Updated: ${updated.name}`);
    notify(`Record for ${updated.name} updated successfully.`, 'success');
  };

  const toggleLockStudent = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, isLocked: !s.isLocked } : s));
  };

  const deleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    notify(`Record for ${student?.name} has been purged.`, 'success');
  };

  const addStaff = (data: Omit<StaffUser, 'id'>) => {
    const newUser: StaffUser = {
      ...data,
      id: 'u' + Math.random().toString(36).substr(2, 5)
    };
    setStaff(prev => [...prev, newUser]);
    notify(`Staff account for ${newUser.name} created.`, 'success');
  };

  const updateStaff = (updated: StaffUser) => {
    setStaff(prev => prev.map(u => u.id === updated.id ? updated : u));
    notify(`Staff profile ${updated.name} updated.`, 'success');
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(u => u.id !== id));
    notify(`Staff access node revoked.`, 'success');
  };

  const addSession = (session: SessionConfig) => {
    setSessions(prev => [...prev, session]);
    notify(`New academic session ${session.name} established.`, 'success');
  };

  const backupDatabase = () => {
    const data = { students, settings, staff, auditLogs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DAS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    logAction('System', 'Full database backup generated.');
    notify('Institutional database backup generated successfully.', 'success');
  };

  return (
    <AppContext.Provider value={{
      students,
      degrees: ['M.Phil', 'PhD'],
      departments: [
        'Animal Breeding & Genetics', 
        'Animal Nutrition', 
        'Bioinformatics', 
        'Chemistry', 
        'Food Science and Technology', 
        'Livestock Management', 
        'Microbiology', 
        'Pathology', 
        'Pharmacology & Toxicology', 
        'Poultry Science', 
        'Biochemistry', 
        'Fisheries & Aquiculture', 
        'Zoology'
      ],
      programmes: [
        'M.Phil Animal Breeding & Genetics',
        'M.Phil Animal Nutrition',
        'M.Phil Bioinformatics',
        'M.Phil Chemistry',
        'M.Phil Food Science and Technology',
        'M.Phil Livestock Management',
        'M.Phil Microbiology',
        'M.Phil Pathology',
        'M.Phil Pharmacology & Toxicology',
        'M.Phil Poultry Science',
        'M.Phil Biochemistry',
        'M.Phil Fisheries & Aquiculture',
        'M.Phil Zoology',
        'PhD Animal Breeding & Genetics',
        'PhD Animal Nutrition',
        'PhD Pathology',
        'PhD Microbiology',
        'PhD Food Science and Technology',
        'PhD Pharmacology and Toxicology',
        'PhD Zoology'
      ],
      faculty: FACULTY_DATABASE,
      settings,
      auditLogs,
      staff,
      sessions,
      currentUser,
      notification,
      notify,
      currentRole: { id: 'r1', roleName: 'System Administrator', canAdd: true, canEdit: true, canDelete: true, canBulkUpload: true, canExport: true, canViewAudit: true, canLockRecords: true },
      login,
      logout,
      addStudent,
      bulkAddStudents,
      updateStudent,
      deleteStudent,
      toggleLockStudent,
      updateSettings: setSettings,
      logAction,
      addStaff,
      updateStaff,
      deleteStaff,
      addSession,
      backupDatabase
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useStore must be used within AppProvider");
  return context;
};
