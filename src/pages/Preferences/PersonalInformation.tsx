import { PhotoGuidelines } from "@/components/personal-info/photo-guidelines";
import { ProfilePhotoUploader } from "@/components/personal-info/profile-photo-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PersonalInformation() {
  return (
    <div className="flex flex-col gap-8 p-6 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold text-center">PERSONAL INFORMATION</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-muted-foreground">
            First Name
          </label>
          <Input
            id="firstName"
            defaultValue="Jawad"
            className="bg-card border-card-foreground/10"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-muted-foreground">
            Last Name
          </label>
          <Input
            id="lastName"
            defaultValue="Ali"
            className="bg-card border-card-foreground/10"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-muted-foreground">
            Address
          </label>
          <Input
            id="address"
            defaultValue="Gowerflower / GN, Fuvahmulah"
            className="bg-card border-card-foreground/10"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="text-muted-foreground">
            Country
          </label>
          <Select defaultValue="maldives">
            <SelectTrigger className="bg-card border-card-foreground/10">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maldives">Maldives</SelectItem>
              <SelectItem value="usa">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
              <SelectItem value="australia">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Button className="bg-success hover:bg-success/90 text-success-foreground">
          Save Changes
        </Button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-6">PROFILE PHOTO</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfilePhotoUploader />
          <PhotoGuidelines />
        </div>
      </div>
    </div>
  );
}
