export interface InvitationToken {
  id: string
  email: string
  token: string
  user_type: 'employee' | 'external'
  expires_at: string
  used: boolean
  created_at: string
}

export interface InvitationRequest {
  email: string
}

export interface RegistrationRequest {
  token: string
  full_name: string
  company_name: string
  project_name: string
  project_code: string
}
