import { 
  projects, phases, unitTypes, calculatorUnitTypes, phaseUnits, calculatorScenarios,
  type Project, type Phase, type UnitType, type CalculatorUnitType, type PhaseUnit, type CalculatorScenario,
  type InsertProject, type InsertPhase, type InsertUnitType, type InsertCalculatorUnitType, type InsertPhaseUnit, type InsertCalculatorScenario,
  type PhaseWithUnits, type ProjectSummary, type FuturePhaseDefaults, type InsertFuturePhaseDefaults
} from "@shared/schema";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;

  // Phases
  getPhases(projectId: number): Promise<PhaseWithUnits[]>;
  getPhase(id: number): Promise<PhaseWithUnits | undefined>;
  createPhase(phase: InsertPhase): Promise<Phase>;
  updatePhase(id: number, phase: Partial<InsertPhase>): Promise<Phase>;
  deletePhase(id: number): Promise<void>;

  // Unit Types (for project tracking)
  getUnitTypes(): Promise<UnitType[]>;
  createUnitType(unitType: InsertUnitType): Promise<UnitType>;
  updateUnitType(id: number, unitType: Partial<InsertUnitType>): Promise<UnitType>;

  // Calculator Unit Types (for calculator only)
  getCalculatorUnitTypes(): Promise<CalculatorUnitType[]>;
  createCalculatorUnitType(unitType: InsertCalculatorUnitType): Promise<CalculatorUnitType>;
  updateCalculatorUnitType(id: number, unitType: Partial<InsertCalculatorUnitType>): Promise<CalculatorUnitType>;
  deleteCalculatorUnitType(id: number): Promise<void>;

  // Phase Units
  createPhaseUnit(phaseUnit: InsertPhaseUnit): Promise<PhaseUnit>;
  updatePhaseUnit(id: number, phaseUnit: Partial<InsertPhaseUnit>): Promise<PhaseUnit>;
  deletePhaseUnit(id: number): Promise<void>;
  getPhaseUnits(phaseId: number): Promise<(PhaseUnit & { unitType: UnitType })[]>;

  // Calculator Scenarios
  getCalculatorScenario(calculatorUnitTypeId: number): Promise<CalculatorScenario | undefined>;
  saveCalculatorScenario(scenario: InsertCalculatorScenario): Promise<CalculatorScenario>;

   // Future Phase Defaults
  getFuturePhaseDefaults(projectId: number, unitTypeId: number): Promise<FuturePhaseDefaults | undefined>;
  saveFuturePhaseDefaults(data: InsertFuturePhaseDefaults): Promise<FuturePhaseDefaults>;

  // Summary
  getProjectSummary(projectId: number): Promise<ProjectSummary>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private phases: Map<number, Phase>;
  private unitTypes: Map<number, UnitType>;
  private calculatorUnitTypes: Map<number, CalculatorUnitType>;
  private phaseUnits: Map<number, PhaseUnit>;
  private calculatorScenarios: Map<number, CalculatorScenario>;
  private futurePhaseDefaults: Map<number, FuturePhaseDefaults>;
  private currentProjectId: number;
  private currentPhaseId: number;
  private currentUnitTypeId: number;
  private currentCalculatorUnitTypeId: number;
  private currentPhaseUnitId: number;
  private currentScenarioId: number;
  private currentFuturePhaseDefaultsId: number;

  constructor() {
    this.projects = new Map();
    this.phases = new Map();
    this.unitTypes = new Map();
    this.calculatorUnitTypes = new Map();
    this.phaseUnits = new Map();
    this.calculatorScenarios = new Map();
    this.futurePhaseDefaults = new Map();
    this.currentProjectId = 1;
    this.currentPhaseId = 1;
    this.currentUnitTypeId = 1;
    this.currentCalculatorUnitTypeId = 1;
    this.currentPhaseUnitId = 1;
    this.currentScenarioId = 1;
    this.currentFuturePhaseDefaultsId = 1;

    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create multiple sample projects
    const projects = [
      {
        id: 1,
        name: "Townhome Development Project",
        description: "Multi-phase townhome development with 12 phases",
        totalPhases: 12
      },
      {
        id: 2,
        name: "Luxury Condo Complex",
        description: "High-end condominium development in downtown area",
        totalPhases: 8
      },
      {
        id: 3,
        name: "Suburban Housing Estate",
        description: "Family-friendly housing development with amenities",
        totalPhases: 15
      }
    ];

    projects.forEach(project => {
      this.projects.set(project.id, project);
    });
    this.currentProjectId = 4;

    // Create default unit types
    const unitTypeA: UnitType = { 
      id: 1, 
      name: "Type A", 
      squareFootage: 1200, 
      bedrooms: 2, 
      lockOffFlexRooms: 1, 
      totalUnitsInDevelopment: 120,
      startDate: null,
      occupancyDate: null
    };
    const unitTypeB: UnitType = { 
      id: 2, 
      name: "Type B", 
      squareFootage: 1450, 
      bedrooms: 3, 
      lockOffFlexRooms: 1, 
      totalUnitsInDevelopment: 80,
      startDate: null,
      occupancyDate: null
    };
    const unitTypeC: UnitType = { 
      id: 3, 
      name: "Type C", 
      squareFootage: 1650, 
      bedrooms: 3, 
      lockOffFlexRooms: 2, 
      totalUnitsInDevelopment: 60,
      startDate: null,
      occupancyDate: null
    };

    this.unitTypes.set(1, unitTypeA);
    this.unitTypes.set(2, unitTypeB);
    this.unitTypes.set(3, unitTypeC);
    this.currentUnitTypeId = 4;

    // Create calculator-specific unit types
    const calculatorUnitTypes = [
      {
        id: 1,
        name: "Studio Apartment",
        squareFootage: 500,
        bedrooms: 0,
        lockOffFlexRooms: 0,
        description: "Compact studio unit for urban development"
      },
      {
        id: 2,
        name: "One Bedroom",
        squareFootage: 750,
        bedrooms: 1,
        lockOffFlexRooms: 0,
        description: "Standard one bedroom apartment"
      },
      {
        id: 3,
        name: "Two Bedroom",
        squareFootage: 1100,
        bedrooms: 2,
        lockOffFlexRooms: 1,
        description: "Two bedroom unit with flex space"
      },
      {
        id: 4,
        name: "Penthouse",
        squareFootage: 1800,
        bedrooms: 3,
        lockOffFlexRooms: 2,
        description: "Luxury penthouse unit"
      }
    ];

    calculatorUnitTypes.forEach(unitType => {
      this.calculatorUnitTypes.set(unitType.id, unitType);
    });
    this.currentCalculatorUnitTypeId = 5;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const project: Project = { 
      id: this.currentProjectId++,
      name: insertProject.name,
      description: insertProject.description ?? null,
      totalPhases: insertProject.totalPhases || 12
    };
    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) throw new Error("Project not found");

    const updated = { ...existing, ...updateData };
    this.projects.set(id, updated);
    return updated;
  }

  async getPhases(projectId: number): Promise<PhaseWithUnits[]> {
    const projectPhases = Array.from(this.phases.values()).filter(p => p.projectId === projectId);

    const phasesWithUnits = await Promise.all(
      projectPhases.map(async (phase) => ({
        ...phase,
        units: await this.getPhaseUnits(phase.id)
      }))
    );

    return phasesWithUnits;
  }

  async getPhase(id: number): Promise<PhaseWithUnits | undefined> {
    const phase = this.phases.get(id);
    if (!phase) return undefined;

    return {
      ...phase,
      units: await this.getPhaseUnits(id)
    };
  }

  async createPhase(insertPhase: InsertPhase): Promise<Phase> {
    const phase: Phase = { 
      ...insertPhase, 
      id: this.currentPhaseId++,
      totalSquareFootage: insertPhase.totalSquareFootage || null
    };
    this.phases.set(phase.id, phase);
    return phase;
  }

  async updatePhase(id: number, updateData: Partial<InsertPhase>): Promise<Phase> {
    const existing = this.phases.get(id);
    if (!existing) throw new Error("Phase not found");

    const updated = { ...existing, ...updateData };
    this.phases.set(id, updated);
    return updated;
  }

  async deletePhase(id: number): Promise<void> {
    this.phases.delete(id);
    // Also delete associated phase units
    const unitsToDelete = Array.from(this.phaseUnits.entries())
      .filter(([_, unit]) => unit.phaseId === id)
      .map(([unitId, _]) => unitId);

    unitsToDelete.forEach(unitId => this.phaseUnits.delete(unitId));
  }

  async getUnitTypes(): Promise<UnitType[]> {
    return Array.from(this.unitTypes.values());
  }

  async createUnitType(insertUnitType: InsertUnitType): Promise<UnitType> {
    const unitType: UnitType = { 
      ...insertUnitType, 
      id: this.currentUnitTypeId++,
      bedrooms: insertUnitType.bedrooms || 0,
      lockOffFlexRooms: insertUnitType.lockOffFlexRooms || 0,
      totalUnitsInDevelopment: insertUnitType.totalUnitsInDevelopment || 0,
      startDate: insertUnitType.startDate || null,
      occupancyDate: insertUnitType.occupancyDate || null
    };
    this.unitTypes.set(unitType.id, unitType);
    return unitType;
  }

  async updateUnitType(id: number, updateData: Partial<InsertUnitType>): Promise<UnitType> {
    const existing = this.unitTypes.get(id);
    if (!existing) throw new Error("Unit type not found");

    const updated = { ...existing, ...updateData };
    this.unitTypes.set(id, updated);
    return updated;
  }

  async getCalculatorUnitTypes(): Promise<CalculatorUnitType[]> {
    return Array.from(this.calculatorUnitTypes.values());
  }

  async createCalculatorUnitType(insertUnitType: InsertCalculatorUnitType): Promise<CalculatorUnitType> {
    const unitType: CalculatorUnitType = { 
      id: this.currentCalculatorUnitTypeId++,
      name: insertUnitType.name,
      squareFootage: insertUnitType.squareFootage,
      bedrooms: insertUnitType.bedrooms || 1,
      lockOffFlexRooms: insertUnitType.lockOffFlexRooms || 0,
      description: insertUnitType.description || null
    };
    this.calculatorUnitTypes.set(unitType.id, unitType);
    return unitType;
  }

  async updateCalculatorUnitType(id: number, updateData: Partial<InsertCalculatorUnitType>): Promise<CalculatorUnitType> {
    const existing = this.calculatorUnitTypes.get(id);
    if (!existing) throw new Error("Calculator unit type not found");

    const updated = { ...existing, ...updateData };
    this.calculatorUnitTypes.set(id, updated);
    return updated;
  }

  async deleteCalculatorUnitType(id: number): Promise<void> {
    // Check if any calculator scenarios are using this unit type
    const scenarios = Array.from(this.calculatorScenarios.values());
    const hasScenarios = scenarios.some(scenario => scenario.calculatorUnitTypeId === id);
    
    if (hasScenarios) {
      throw new Error("Cannot delete unit type that has saved scenarios");
    }

    this.calculatorUnitTypes.delete(id);
  }

  async createPhaseUnit(insertPhaseUnit: InsertPhaseUnit): Promise<PhaseUnit> {
    const phaseUnit: PhaseUnit = { 
      ...insertPhaseUnit, 
      id: this.currentPhaseUnitId++,
      hardCosts: insertPhaseUnit.hardCosts || null,
      softCosts: insertPhaseUnit.softCosts || null,
      landCosts: insertPhaseUnit.landCosts || null,
      salesPrice: insertPhaseUnit.salesPrice || null,
      contingencyCosts: insertPhaseUnit.contingencyCosts || null,
      salesCosts: insertPhaseUnit.salesCosts || null,
      lawyerFees: insertPhaseUnit.lawyerFees || null,
      constructionFinancing: insertPhaseUnit.constructionFinancing || "0",
      useConstructionFinancing: insertPhaseUnit.useConstructionFinancing || false,
      hardCostsInputMethod: insertPhaseUnit.hardCostsInputMethod || 'perUnit',
      softCostsInputMethod: insertPhaseUnit.softCostsInputMethod || 'perUnit',
      landCostsInputMethod: insertPhaseUnit.landCostsInputMethod || 'perUnit',
      contingencyCostsInputMethod: insertPhaseUnit.contingencyCostsInputMethod || 'perUnit',
      salesCostsInputMethod: insertPhaseUnit.salesCostsInputMethod || 'perUnit',
      lawyerFeesInputMethod: insertPhaseUnit.lawyerFeesInputMethod || 'perUnit',
      constructionFinancingInputMethod: insertPhaseUnit.constructionFinancingInputMethod || 'perUnit'
    };
    this.phaseUnits.set(phaseUnit.id, phaseUnit);
    return phaseUnit;
  }

  async updatePhaseUnit(id: number, updateData: Partial<InsertPhaseUnit>): Promise<PhaseUnit> {
    const existing = this.phaseUnits.get(id);
    if (!existing) throw new Error("Phase unit not found");

    const updated = { ...existing, ...updateData };
    this.phaseUnits.set(id, updated);
    return updated;
  }

  async deletePhaseUnit(id: number): Promise<void> {
    this.phaseUnits.delete(id);
  }

  async getPhaseUnits(phaseId: number): Promise<(PhaseUnit & { unitType: UnitType })[]> {
    const units = Array.from(this.phaseUnits.values()).filter(u => u.phaseId === phaseId);

    return units.map(unit => {
      const unitType = this.unitTypes.get(unit.unitTypeId);
      if (!unitType) throw new Error("Unit type not found");
      return { ...unit, unitType };
    });
  }

  async getCalculatorScenario(calculatorUnitTypeId: number): Promise<CalculatorScenario | undefined> {
    return Array.from(this.calculatorScenarios.values()).find(s => s.calculatorUnitTypeId === calculatorUnitTypeId);
  }

  async saveCalculatorScenario(insertScenario: InsertCalculatorScenario): Promise<CalculatorScenario> {
    // Check if scenario already exists for this calculator unit type
    const existing = Array.from(this.calculatorScenarios.values()).find(s => s.calculatorUnitTypeId === insertScenario.calculatorUnitTypeId);

    if (existing) {
      const updated = { ...existing, ...insertScenario };
      this.calculatorScenarios.set(existing.id, updated);
      return updated;
    } else {
      const scenario: CalculatorScenario = { 
        ...insertScenario, 
        id: this.currentScenarioId++,
        constructionFinancing: insertScenario.constructionFinancing || "0",
        useConstructionFinancing: insertScenario.useConstructionFinancing || false,
        hardCostsInputMethod: insertScenario.hardCostsInputMethod || 'perUnit',
        softCostsInputMethod: insertScenario.softCostsInputMethod || 'perUnit',
        landCostsInputMethod: insertScenario.landCostsInputMethod || 'perUnit',
        contingencyCostsInputMethod: insertScenario.contingencyCostsInputMethod || 'perUnit',
        salesCostsInputMethod: insertScenario.salesCostsInputMethod || 'perUnit',
        lawyerFeesInputMethod: insertScenario.lawyerFeesInputMethod || 'perUnit',
        constructionFinancingInputMethod: insertScenario.constructionFinancingInputMethod || 'perUnit',
        scenario1Price: insertScenario.scenario1Price || null,
        scenario2Price: insertScenario.scenario2Price || null,
        scenario3Price: insertScenario.scenario3Price || null,
        scenario4Price: insertScenario.scenario4Price || null
      };
      this.calculatorScenarios.set(scenario.id, scenario);
      return scenario;
    }
  }

  async getFuturePhaseDefaults(projectId: number, unitTypeId: number): Promise<FuturePhaseDefaults | undefined> {
    return Array.from(this.futurePhaseDefaults.values()).find(d => d.projectId === projectId && d.unitTypeId === unitTypeId);
  }

  async saveFuturePhaseDefaults(insertDefaults: InsertFuturePhaseDefaults): Promise<FuturePhaseDefaults> {
    // Check if defaults already exists for this project and unit type
    const existing = Array.from(this.futurePhaseDefaults.values()).find(d => d.projectId === insertDefaults.projectId && d.unitTypeId === insertDefaults.unitTypeId);

    if (existing) {
      const updated = { ...existing, ...insertDefaults };
      this.futurePhaseDefaults.set(existing.id, updated);
      return updated;
    } else {
      const defaults: FuturePhaseDefaults = { 
        ...insertDefaults, 
        id: this.currentFuturePhaseDefaultsId++,
        hardCosts: insertDefaults.hardCosts || null,
        softCosts: insertDefaults.softCosts || null,
        landCosts: insertDefaults.landCosts || null,
        contingencyCosts: insertDefaults.contingencyCosts || null,
        salesCosts: insertDefaults.salesCosts || null,
        lawyerFees: insertDefaults.lawyerFees || null,
        constructionFinancing: insertDefaults.constructionFinancing || "0",
        useConstructionFinancing: insertDefaults.useConstructionFinancing || false,
        hardCostsInputMethod: insertDefaults.hardCostsInputMethod || 'perUnit',
        softCostsInputMethod: insertDefaults.softCostsInputMethod || 'perUnit',
        landCostsInputMethod: insertDefaults.landCostsInputMethod || 'perUnit',
        contingencyCostsInputMethod: insertDefaults.contingencyCostsInputMethod || 'perUnit',
        salesCostsInputMethod: insertDefaults.salesCostsInputMethod || 'perUnit',
        lawyerFeesInputMethod: insertDefaults.lawyerFeesInputMethod || 'perUnit',
        constructionFinancingInputMethod: insertDefaults.constructionFinancingInputMethod || 'perUnit',
        isActive: insertDefaults.isActive || false
      };
      this.futurePhaseDefaults.set(defaults.id, defaults);
      return defaults;
    }
  }

  async getProjectSummary(projectId: number): Promise<ProjectSummary> {
    const projectPhases = Array.from(this.phases.values()).filter(p => p.projectId === projectId);
    const completedPhases = projectPhases.filter(p => p.status === 'completed').length;

    let totalUnits = 0;
    let totalCosts = 0;
    let totalRevenue = 0;

    for (const phase of projectPhases) {
      const units = await this.getPhaseUnits(phase.id);

      for (const unit of units) {
        totalUnits += unit.quantity;

        if (unit.hardCosts && unit.softCosts && unit.landCosts && unit.contingencyCosts && unit.salesPrice) {
          const hardCosts = parseFloat(unit.hardCosts);
          const softCosts = parseFloat(unit.softCosts);
          const landCosts = parseFloat(unit.landCosts);
          const contingencyCosts = parseFloat(unit.contingencyCosts);
          const salesPrice = parseFloat(unit.salesPrice);

          // Calculate sales costs
          const salesCosts = this.calculateSalesCosts(salesPrice);

          const unitTotalCosts = (hardCosts + softCosts + landCosts + contingencyCosts + salesCosts) * unit.quantity;
          const unitRevenue = salesPrice * unit.quantity;

          totalCosts += unitTotalCosts;
          totalRevenue += unitRevenue;
        }
      }
    }

    const overallMargin = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0;
    const overallROI = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalCosts) * 100 : 0;

    return {
      totalPhases: projectPhases.length,
      completedPhases,
      totalUnits,
      overallMargin: Math.round(overallMargin * 10) / 10,
      overallROI: Math.round(overallROI * 10) / 10,
      totalCosts,
      totalRevenue
    };
  }

  private calculateSalesCosts(salesPrice: number): number {
    const first100k = Math.min(salesPrice, 100000);
    const balance = Math.max(0, salesPrice - 100000);
    return (first100k * 0.05) + (balance * 0.03);
  }
}

export const storage = new MemStorage();