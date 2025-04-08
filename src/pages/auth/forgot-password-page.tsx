// import { X } from "lucide-react";
// import AnimatedBackground from "./animated-background";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Link } from "react-router-dom";

// export default function ForgotPasswordPage() {
//   return (
//     <div className="relative min-h-screen flex items-center justify-center p-4">
//       <AnimatedBackground />

//       <Card className="w-full max-w-md bg-card/90 backdrop-blur-md border-border shadow-xl z-10 relative">
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <h1 className="text-xl font-bold tracking-wider text-card-foreground">
//             FORGOT PASSWORD?
//           </h1>
//           <Link
//             to="/login"
//             className="text-muted-foreground hover:text-card-foreground"
//           >
//             <X className="h-5 w-5" />
//           </Link>
//         </CardHeader>
//         <CardContent className="space-y-4 pt-4">
//           <p className="text-card-foreground/80 text-sm">
//             Please submit an email used for registration, check your inbox and
//             follow the instructions provided
//           </p>
//           <div className="space-y-2">
//             <Input
//               id="email"
//               type="email"
//               placeholder="name@example.com"
//               className="bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
//             />
//           </div>
//           <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6">
//             SUBMIT
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client";

import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AnimatedBackground from "./animated-background";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";

// Define the form schema with validation
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordPage() {
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send a password reset email
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />

      <Card className="w-full max-w-md bg-card/90 backdrop-blur-md border-border shadow-xl z-10 relative">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h1 className="text-xl font-bold tracking-wider text-card-foreground">
            FORGOT PASSWORD?
          </h1>
          <Link
            to="/login"
            className="text-muted-foreground hover:text-card-foreground"
          >
            <X className="h-5 w-5" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p className="text-card-foreground/80 text-sm">
            Please submit an email used for registration, check your inbox and
            follow the instructions provided
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                        className="bg-muted/70 border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6"
              >
                SUBMIT
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
