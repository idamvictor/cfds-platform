import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeOff } from "lucide-react";
import { CurrencySelector } from "@/components/settings/currency-selector";
import { LanguageSelector } from "@/components/settings/language-selector";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [activationCode] = React.useState(
    "EN5WMXKWPMUT45JZGNCU2M2AJBAGGPDUHAWI"
  );
  const [authCode, setAuthCode] = React.useState("");

  const handleChangePassword = () => {
    // Handle password change logic
    console.log("Changing password");
  };

  const handleActivate2FA = () => {
    // Handle 2FA activation logic
    console.log("Activating 2FA");
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold text-center">SETTINGS</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password Update Section */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>UPDATE PASSWORD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="currentPassword"
                className="text-muted-foreground"
              >
                Current Password
              </label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-card border-card-foreground/10 pr-10"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <EyeOff className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-muted-foreground">
                New Password
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-card border-card-foreground/10 pr-10"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <EyeOff className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-muted-foreground"
              >
                Confirm new password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-card border-card-foreground/10 pr-10"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <EyeOff className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Button
              onClick={handleChangePassword}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* 2FA Section */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>ACTIVATE 2FA PROTECTION</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-muted-foreground">
                Activation code for Google Authenticator
              </label>
              <Input
                value={activationCode}
                readOnly
                className="bg-card border-card-foreground/10 font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="authCode" className="text-muted-foreground">
                Activate Authenticator and enter a generated code in field below
              </label>
              <Input
                id="authCode"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="bg-card border-card-foreground/10"
                placeholder="Enter code"
              />
            </div>

            <div className="space-y-2">
              <label className="text-muted-foreground">QR Code</label>
              <div className="bg-white p-4 inline-block">
                <img
                  src="/placeholder.svg?height=180&width=180"
                  alt="QR Code"
                  className="h-[180px] w-[180px]"
                />
              </div>
            </div>

            <Button
              onClick={handleActivate2FA}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              Activate 2FA Protection
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Currency Section */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>DASHBOARD CURRENCY</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrencySelector />
        </CardContent>
      </Card>

      {/* Language Section */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>DASHBOARD LANGUAGE</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageSelector />
        </CardContent>
      </Card>
    </div>
  );
}
