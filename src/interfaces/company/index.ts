import { EmployeeInterface } from 'interfaces/employee';
import { HrInterface } from 'interfaces/hr';
import { JobInterface } from 'interfaces/job';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CompanyInterface {
  id?: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  employee?: EmployeeInterface[];
  hr?: HrInterface[];
  job?: JobInterface[];
  user?: UserInterface;
  _count?: {
    employee?: number;
    hr?: number;
    job?: number;
  };
}

export interface CompanyGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
