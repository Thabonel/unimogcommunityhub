
import { UserProfile } from "@/types/user";

interface UserProfileTabProps {
  profile: UserProfile;
}

export function UserProfileTab({ profile }: UserProfileTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="text-md font-medium">Contact Information</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd>{profile.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
              <dd>{profile.phone_number || "Not provided"}</dd>
            </div>
          </dl>
        </div>
        
        {/* Address Info */}
        <div className="space-y-3">
          <h3 className="text-md font-medium">Address</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Street</dt>
              <dd>{profile.street_address || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">City/State</dt>
              <dd>
                {profile.city && profile.state 
                  ? `${profile.city}, ${profile.state}` 
                  : "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Country</dt>
              <dd>{profile.country || "Not provided"}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Bio/About */}
      <div className="mt-4 pt-4 border-t">
        <h3 className="text-md font-medium mb-2">Bio</h3>
        <p className="text-sm">{profile.bio || "No bio provided."}</p>
      </div>
      
      {/* Unimog Information */}
      {(profile.unimog_model || profile.unimog_year || profile.unimog_modifications) && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-md font-medium mb-2">Unimog Information</h3>
          <dl className="space-y-2">
            {profile.unimog_model && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Model</dt>
                <dd>{profile.unimog_model}</dd>
              </div>
            )}
            {profile.unimog_year && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Year</dt>
                <dd>{profile.unimog_year}</dd>
              </div>
            )}
            {profile.unimog_modifications && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Modifications</dt>
                <dd>{profile.unimog_modifications}</dd>
              </div>
            )}
            {profile.experience_level && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Experience Level</dt>
                <dd>{profile.experience_level}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
