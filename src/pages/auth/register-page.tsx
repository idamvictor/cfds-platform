import { useState } from "react";
import { Eye, EyeOff, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnimatedBackground from "./animated-background";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />

      <Card className="w-full max-w-md bg-card/90 backdrop-blur-md border-border shadow-xl z-10 relative">
        <CardHeader className="space-y-1 pb-2">
          <div className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-wider text-card-foreground">
              CREATE A NEW ACCOUNT
            </h1>
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
              htmlFor="fullname"
              className="text-sm font-medium text-card-foreground"
            >
              Full Name
            </label>
            <Input
              id="fullname"
              type="text"
              placeholder="John Doe"
              className="bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="country"
              className="text-sm font-medium text-card-foreground"
            >
              Country
            </label>
            <Select>
              <SelectTrigger className="bg-muted/70 border-border text-card-foreground focus:ring-primary">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-card-foreground">
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="eu">European Union</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-card-foreground"
            >
              Phone
            </label>
            <div className="flex">
              <div className="flex items-center px-3 bg-muted border border-r-0 border-border rounded-l-md">
                <span className="text-card-foreground flex items-center gap-1">
                  <span className="inline-block w-5 h-3 bg-destructive relative overflow-hidden rounded-sm">
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-5 h-0.5 bg-white absolute"></span>
                      <span className="w-0.5 h-3 bg-white absolute"></span>
                    </span>
                  </span>
                  +44
                </span>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="7911 123456"
                className="rounded-l-none bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
            </div>
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

          <div className="space-y-2">
            <label
              htmlFor="currency"
              className="text-sm font-medium text-card-foreground"
            >
              Currency
            </label>
            <Select defaultValue="usd">
              <SelectTrigger className="bg-muted/70 border-border text-card-foreground focus:ring-primary">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-5 h-3 bg-accent relative overflow-hidden rounded-sm">
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-[8px]">$</span>
                    </span>
                  </span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-card-foreground">
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="gbp">GBP</SelectItem>
                <SelectItem value="jpy">JPY</SelectItem>
                <SelectItem value="cad">CAD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 mt-2">
            CREATE ACCOUNT
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-0">
          <div className="flex items-center justify-center space-x-2 text-sm text-card-foreground/80">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Login
            </Link>
          </div>
          <div className="flex items-center justify-center text-sm">
            <Link
              to="/register"
              className="text-primary hover:text-primary/90 font-medium"
            >
              I have a promo-code
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
