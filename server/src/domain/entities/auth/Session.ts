// ═══════════════════════════════════════════════════════════════
// DOMAIN ENTITY: Session
// ═══════════════════════════════════════════════════════════════
//
// Represents an authentication session.
// When a user logs in, we create a Session with their token info.
// This is useful for tracking active sessions, token expiry, etc.
// ═══════════════════════════════════════════════════════════════

export interface SessionProps {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}

export class Session {
  public readonly userId: string;
  public readonly token: string;
  public readonly expiresAt: Date;
  public readonly createdAt: Date;

  constructor(props: SessionProps) {
    this.userId = props.userId;
    this.token = props.token;
    this.expiresAt = props.expiresAt;
    this.createdAt = props.createdAt || new Date();
  }

  /**
   * Check if this session has expired.
   * Used to reject requests with old tokens.
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
