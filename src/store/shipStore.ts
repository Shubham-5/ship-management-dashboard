import { create } from 'zustand';
import { LOCAL_STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/localStorage';

export interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
  description?: string;
  yearBuilt?: number;
  owner?: string;
}

export interface Component {
  id: string;
  shipId: string;
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
  status: 'Good' | 'Needs Maintenance' | 'Critical';
  description?: string;
}

export interface MaintenanceJob {
  id: string;
  componentId: string;
  shipId: string;
  type: 'Inspection' | 'Repair' | 'Replacement' | 'Preventive';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedEngineerId: string;
  scheduledDate: string;
  completedDate?: string;
  description?: string;
  notes?: string;
}

interface ShipState {
  ships: Ship[];
  components: Component[];
  jobs: MaintenanceJob[];
  
  addShip: (ship: Omit<Ship, 'id'>) => void;
  updateShip: (id: string, updates: Partial<Ship>) => void;
  deleteShip: (id: string) => void;
  getShipById: (id: string) => Ship | undefined;
  
  addComponent: (component: Omit<Component, 'id'>) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  getComponentsByShipId: (shipId: string) => Component[];
  
  addJob: (job: Omit<MaintenanceJob, 'id'>) => void;
  updateJob: (id: string, updates: Partial<MaintenanceJob>) => void;
  deleteJob: (id: string) => void;
  getJobsByShipId: (shipId: string) => MaintenanceJob[];
  getJobsByStatus: (status: MaintenanceJob['status']) => MaintenanceJob[];
  
  initializeData: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// Initialize default data
const initializeDefaultData = () => {
  const existingShips = getFromStorage(LOCAL_STORAGE_KEYS.SHIPS);
  const existingComponents = getFromStorage(LOCAL_STORAGE_KEYS.COMPONENTS);
  const existingJobs = getFromStorage(LOCAL_STORAGE_KEYS.JOBS);

  if (!existingShips) {
    const defaultShips: Ship[] = [
      { id: "s1", name: "Ever Given", imo: "9811000", flag: "Panama", status: "Active", yearBuilt: 2018, owner: "Evergreen Marine" },
      { id: "s2", name: "Maersk Alabama", imo: "9164263", flag: "USA", status: "Under Maintenance", yearBuilt: 2008, owner: "Maersk Line" },
      { id: "s3", name: "MSC Oscar", imo: "9756564", flag: "Panama", status: "Active", yearBuilt: 2015, owner: "MSC" }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.SHIPS, defaultShips);
  }

  if (!existingComponents) {
    const defaultComponents: Component[] = [
      { id: "c1", shipId: "s1", name: "Main Engine", serialNumber: "ME-1234", installDate: "2020-01-10", lastMaintenanceDate: "2024-03-12", status: "Good" },
      { id: "c2", shipId: "s2", name: "Radar", serialNumber: "RAD-5678", installDate: "2021-07-18", lastMaintenanceDate: "2023-12-01", status: "Needs Maintenance" },
      { id: "c3", shipId: "s1", name: "Navigation System", serialNumber: "NAV-9012", installDate: "2020-02-15", lastMaintenanceDate: "2024-01-20", status: "Good" },
      { id: "c4", shipId: "s3", name: "Propeller", serialNumber: "PROP-3456", installDate: "2019-05-22", lastMaintenanceDate: "2023-11-15", status: "Critical" }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.COMPONENTS, defaultComponents);
  }

  if (!existingJobs) {
    const defaultJobs: MaintenanceJob[] = [
      { id: "j1", componentId: "c1", shipId: "s1", type: "Inspection", priority: "High", status: "Open", assignedEngineerId: "3", scheduledDate: "2025-07-05", description: "Routine engine inspection" },
      { id: "j2", componentId: "c2", shipId: "s2", type: "Repair", priority: "Critical", status: "In Progress", assignedEngineerId: "3", scheduledDate: "2025-06-30", description: "Radar malfunction repair" },
      { id: "j3", componentId: "c4", shipId: "s3", type: "Replacement", priority: "Critical", status: "Open", assignedEngineerId: "3", scheduledDate: "2025-07-10", description: "Propeller replacement due to damage" }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.JOBS, defaultJobs);
  }
};

export const useShipStore = create<ShipState>((set, get) => ({
  ships: [],
  components: [],
  jobs: [],

  addShip: (shipData) => {
    const newShip = { ...shipData, id: generateId() };
    const ships = [...get().ships, newShip];
    set({ ships });
    saveToStorage(LOCAL_STORAGE_KEYS.SHIPS, ships);
  },

  updateShip: (id, updates) => {
    const ships = get().ships.map(ship => 
      ship.id === id ? { ...ship, ...updates } : ship
    );
    set({ ships });
    saveToStorage(LOCAL_STORAGE_KEYS.SHIPS, ships);
  },

  deleteShip: (id) => {
    const ships = get().ships.filter(ship => ship.id !== id);
    const components = get().components.filter(comp => comp.shipId !== id);
    const jobs = get().jobs.filter(job => job.shipId !== id);
    
    set({ ships, components, jobs });
    saveToStorage(LOCAL_STORAGE_KEYS.SHIPS, ships);
    saveToStorage(LOCAL_STORAGE_KEYS.COMPONENTS, components);
    saveToStorage(LOCAL_STORAGE_KEYS.JOBS, jobs);
  },

  getShipById: (id) => get().ships.find(ship => ship.id === id),

  addComponent: (componentData) => {
    const newComponent = { ...componentData, id: generateId() };
    const components = [...get().components, newComponent];
    set({ components });
    saveToStorage(LOCAL_STORAGE_KEYS.COMPONENTS, components);
  },

  updateComponent: (id, updates) => {
    const components = get().components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    );
    set({ components });
    saveToStorage(LOCAL_STORAGE_KEYS.COMPONENTS, components);
  },

  deleteComponent: (id) => {
    const components = get().components.filter(comp => comp.id !== id);
    const jobs = get().jobs.filter(job => job.componentId !== id);
    
    set({ components, jobs });
    saveToStorage(LOCAL_STORAGE_KEYS.COMPONENTS, components);
    saveToStorage(LOCAL_STORAGE_KEYS.JOBS, jobs);
  },

  getComponentsByShipId: (shipId) => 
    get().components.filter(comp => comp.shipId === shipId),

  addJob: (jobData) => {
    const newJob = { ...jobData, id: generateId() };
    const jobs = [...get().jobs, newJob];
    set({ jobs });
    saveToStorage(LOCAL_STORAGE_KEYS.JOBS, jobs);
  },

  updateJob: (id, updates) => {
    const jobs = get().jobs.map(job => 
      job.id === id ? { ...job, ...updates } : job
    );
    set({ jobs });
    saveToStorage(LOCAL_STORAGE_KEYS.JOBS, jobs);
  },

  deleteJob: (id) => {
    const jobs = get().jobs.filter(job => job.id !== id);
    set({ jobs });
    saveToStorage(LOCAL_STORAGE_KEYS.JOBS, jobs);
  },

  getJobsByShipId: (shipId) => 
    get().jobs.filter(job => job.shipId === shipId),

  getJobsByStatus: (status) => 
    get().jobs.filter(job => job.status === status),

  // Initialize default data
  initializeData: () => {
    initializeDefaultData();
    const ships = getFromStorage(LOCAL_STORAGE_KEYS.SHIPS) || [];
    const components = getFromStorage(LOCAL_STORAGE_KEYS.COMPONENTS) || [];
    const jobs = getFromStorage(LOCAL_STORAGE_KEYS.JOBS) || [];
    set({ ships, components, jobs });
  }
}));
