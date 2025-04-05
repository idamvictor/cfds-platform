import { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import AnimatedBackground from "./animated-background";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />

      <Card className="w-full max-w-md bg-card/90 backdrop-blur-md border-border shadow-xl z-10 relative">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="flex items-center justify-center gap-2">
            <User className="h-6 w-6 text-card-foreground" />
            <h1 className="text-xl font-bold tracking-wider text-card-foreground">
              LOGIN TO TRADEROOM
            </h1>
          </div>
          <div className="text-3xl font-bold text-primary tracking-tight">
            $ 402.54
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-card-foreground"
            >
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-card-foreground"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6">
            SIGN IN
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-0">
          <div className="flex items-center justify-center space-x-2 text-sm text-card-foreground/80">
            <span>Forgot Password?</span>
            <Link
              to="/login"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Restore
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-card-foreground/80">
            <span>Don&apos;t have an account?</span>
            <Link
              to="/register"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
