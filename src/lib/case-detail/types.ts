export type DossierStatusHistoryItem = {
  id: string;
  status: string;
  changedByName: string;
  notes: string | null;
  createdAt: string;
};

export type DossierAssignmentItem = {
  id: string;
  userId: string;
  userName: string;
  role: string;
  createdAt: string;
};

export type DossierHouseholdMember = {
  id: string;
  relationship: string;
  isPrimary: boolean;
  person: {
    id: string;
    firstName: string;
    lastName: string;
    nationalId: string | null;
    phone: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    maritalStatus: string | null;
    nationalIdValidationStatus: string;
  };
};

export type DossierVisitAssessment = {
  id: string;
  needType: string;
  score: number | null;
  details: string | null;
  createdAt: string;
};

export type DossierVisit = {
  id: string;
  date: string;
  findings: string;
  assessments: DossierVisitAssessment[];
};

export type DossierDecision = {
  id: string;
  decision: string;
  amount: number | null;
  notes: string | null;
  reviewerName: string;
  createdAt: string;
};

export type DossierDelivery = {
  id: string;
  date: string;
  amount: number | null;
  items: string | null;
  notes: string | null;
};

export type DossierIntervention = {
  id: string;
  type: string;
  description: string | null;
  cost: number | null;
  status: string;
  createdAt: string;
  deliveries: DossierDelivery[];
};

export type DossierFollowUp = {
  id: string;
  date: string;
  status: string;
  notes: string;
  createdAt: string;
};

export type DossierDocument = {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  category: string | null;
  createdAt: string;
};

export type DossierNote = {
  id: string;
  content: string;
  createdAt: string;
};

export type CaseDossierData = {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  caseType: string;
  status: string;
  priority: string;
  managerReviewState: string;
  createdAt: string;
  updatedAt: string;
  branchId: string;
  centerName: string | null;
  villageName: string | null;
  household: {
    id: string;
    name: string;
    address: string | null;
    income: number | null;
    members: DossierHouseholdMember[];
  };
  primaryBeneficiary: DossierHouseholdMember["person"] | null;
  assignments: DossierAssignmentItem[];
  statusHistory: DossierStatusHistoryItem[];
  notes: DossierNote[];
  visits: DossierVisit[];
  decisions: DossierDecision[];
  interventions: DossierIntervention[];
  followUps: DossierFollowUp[];
  documents: DossierDocument[];
  intakeRequest: {
    id: string;
    requestorName: string;
    phone: string;
    nationalId: string | null;
    status: string;
    createdAt: string;
  } | null;
};
