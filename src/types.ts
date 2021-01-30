
export interface ResponseData<T> {
  message: string;
  status: string;
  data: T
};

export interface RequestData {
  rule: {
    field: string;
    condition: string; 
    condition_value: any; 
  };
  data: any;
};

export  interface User {  
        name: string;
        github: string;
        email: string;
        mobile: string;
        twitter?: string;
    };

export  interface ValidationData {   
    validation: {
      error: boolean;
      field: string;
      field_value: any;
      condition: string;
      condition_value: string | number;
    }
  };