import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useGetPledgeSummary, useCreatePledge, getGetPledgeSummaryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Gift, Route, Calendar, Heart, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

import carPhoto from "@assets/G9emjJyWcAA2uhm_1775877269348.jpeg";
import davidPhoto from "@assets/IMG_4594_1775877101729.jpeg";

const LIDAR_COLORS = [
  "#00ffff", "#00e5ff", "#40c4ff", "#00b0ff",
  "#00e676", "#76ff03", "#c6ff00",
  "#ffea00", "#ffd740", "#ffab40",
  "#ff6d00", "#ff3d00",
  "#e040fb", "#ea80fc",
  "#ffffff", "#b0bec5",
];

function LidarPhoto() {
  const dots = useMemo(() => {
    return Array.from({ length: 320 }, (_, i) => ({
      id: i,
      cx: Math.random() * 100,
      cy: Math.random() * 100,
      r: Math.random() * 0.7 + 0.2,
      color: LIDAR_COLORS[Math.floor(Math.random() * LIDAR_COLORS.length)],
      opacity: Math.random() * 0.55 + 0.45,
    }));
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/20 aspect-[3/4]">
      <img
        src={davidPhoto}
        alt="David Moss"
        className="w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
      <svg
        className="absolute inset-0 w-full h-full mix-blend-screen"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {dots.map((dot) => (
          <circle
            key={dot.id}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill={dot.color}
            opacity={dot.opacity}
          />
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 right-3">
        <span className="text-xs font-mono text-cyan-400 bg-black/60 px-2 py-1 rounded tracking-widest">
          LIDAR SCAN — POINT CLOUD
        </span>
      </div>
    </div>
  );
}

const formSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  amount: z.coerce.number().min(1, "Minimum pledge is $1").max(300, "Maximum pledge is $300"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: summary, isLoading: isSummaryLoading } = useGetPledgeSummary();
  const createPledge = useCreatePledge();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 20,
    },
  });

  const onSubmit = (values: FormValues) => {
    createPledge.mutate(
      { data: { ...values, name: isAnonymous ? "Anonymous" : values.name } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetPledgeSummaryQueryKey() });
          setHasSubmitted(true);
        },
        onError: (error) => {
          toast({
            title: "Error submitting pledge",
            description: error.error || "Please try again",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleQuickPick = (amount: number) => {
    form.setValue("amount", amount, { shouldValidate: true });
  };

  const progressPercentage = summary ? Math.min((summary.total / summary.goalAmount) * 100, 100) : 0;

  return (
    <div className="min-h-[100dvh] w-full bg-background selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <img 
            src={carPhoto}
            alt="David Moss with his Tesla at a Supercharger" 
            className="w-full h-full object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 container px-4 md:px-6 mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" />
              <span>April 26th Birthday Surprise</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4 font-sans drop-shadow-lg">
              For David Moss.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Celebrating a legendary solo coast-to-coast drive on Full Self-Driving. Let's surprise him with a Starlink Mini.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container px-4 md:px-6 mx-auto py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Story & Progress */}
          <div className="lg:col-span-7 space-y-12">
            
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-semibold tracking-tight font-sans text-foreground flex items-center gap-3">
                <Route className="w-8 h-8 text-primary" />
                The Milestone
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-48 flex-shrink-0">
                  <LidarPhoto />
                </div>
                <div className="prose prose-invert prose-lg text-muted-foreground font-sans">
                  <p>
                    Driving coast-to-coast is an achievement. Doing it entirely on Tesla's Full Self-Driving is a milestone in the history of transportation. David Moss did exactly that, proving what's possible when technology meets determination.
                  </p>
                  <p>
                    As a core member of the Tesla community, David is always sharing insights and pushing the boundaries. For his birthday on April 26th, we're coming together to get him something that pairs perfectly with his road warrior lifestyle: <strong>a Starlink Mini</strong>.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Progress Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card border border-card-border rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
              data-testid="section-progress"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-mono">FUNDING PROGRESS</h3>
                  {isSummaryLoading ? (
                    <Skeleton className="h-10 w-32 bg-secondary" />
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground font-sans tabular-nums" data-testid="text-total">
                        ${summary?.total || 0}
                      </span>
                      <span className="text-xl text-muted-foreground font-sans">
                        / ${summary?.goalAmount || 300}
                      </span>
                    </div>
                  )}
                </div>
                {summary?.goalReached && (
                  <div className="hidden md:flex items-center gap-2 text-primary font-medium px-4 py-2 bg-primary/10 rounded-full">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Goal Reached!</span>
                  </div>
                )}
              </div>

              {isSummaryLoading ? (
                <Skeleton className="h-4 w-full rounded-full bg-secondary my-6" />
              ) : (
                <div className="relative h-4 bg-secondary rounded-full overflow-hidden my-6">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-primary rounded-full"
                  />
                  {summary?.goalReached && (
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                {isSummaryLoading ? (
                  <Skeleton className="h-5 w-40 bg-secondary" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    <span>{summary?.count || 0} supporters have chipped in</span>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Pledgers List */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              data-testid="section-pledgers"
            >
              <h3 className="text-xl font-semibold mb-6 text-foreground font-sans">Recent Supporters</h3>
              {isSummaryLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full bg-secondary" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-secondary" />
                        <Skeleton className="h-3 w-20 bg-secondary" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : summary?.pledges && summary.pledges.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {summary.pledges.map((pledge) => (
                    <div key={pledge.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-card-border">
                      <Avatar className="h-12 w-12 border border-card-border shadow-sm">
                        <AvatarFallback className="bg-secondary text-secondary-foreground font-mono font-bold">
                          {pledge.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground font-sans">{pledge.name}</p>
                        <p className="text-sm text-primary font-mono font-medium">${pledge.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Be the first to chip in!</p>
              )}
            </motion.section>

          </div>

          {/* Right Column: Form / Action */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-8">
              <AnimatePresence mode="wait">
                {summary?.goalReached && !hasSubmitted ? (
                  /* Goal Reached State */
                  <motion.div
                    key="goal-reached"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border border-primary/20 rounded-3xl p-8 shadow-2xl shadow-primary/5 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                      <Gift className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold font-sans text-foreground" data-testid="text-goal-reached">Goal Reached!</h3>
                      <p className="text-muted-foreground">
                        We did it! Thank you to everyone who chipped in for David's Starlink Mini. What an amazing community.
                      </p>
                    </div>
                  </motion.div>
                ) : hasSubmitted ? (
                  /* Venmo Instructions State */
                  <motion.div
                    key="venmo"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border border-primary/20 rounded-3xl p-8 shadow-2xl shadow-primary/5 space-y-6"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-2">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-bold font-sans text-foreground">Pledge Recorded!</h3>
                      <p className="text-muted-foreground">
                        Thank you for your generosity. To complete your contribution, please send your payment via Venmo.
                      </p>
                    </div>
                    
                    <div className="bg-secondary rounded-2xl p-6 space-y-4 border border-card-border">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1 font-mono uppercase tracking-wider">Required Note</p>
                        <p className="text-lg text-primary font-medium font-sans bg-primary/10 inline-block px-3 py-1 rounded-lg select-all">
                          Happy Birthday David
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://venmo.com/u/Rima-Sukhadia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full h-14 rounded-xl bg-[#008CFF] hover:bg-[#007AE0] text-white font-semibold text-lg transition-all shadow-[0_0_20px_rgba(0,140,255,0.3)] hover:shadow-[0_0_30px_rgba(0,140,255,0.5)]"
                    >
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.166 1C20.912 3.667 21.7 6.417 21.7 9.917c0 6.917-5.917 15.75-10.75 21.083H2.3L0 2.417 8.167 1.5l1.25 10.083c1.167-1.917 2.583-5 2.583-7.083 0-1.25-.25-2.083-.583-2.75L19.166 1z"/>
                      </svg>
                      Pay via Venmo
                    </a>
                    
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-xl text-foreground font-medium"
                      onClick={() => setHasSubmitted(false)}
                    >
                      Back
                    </Button>
                  </motion.div>
                ) : (
                  /* Form State */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="border-card-border bg-card shadow-2xl rounded-3xl overflow-hidden">
                      <CardHeader className="pb-6 border-b border-card-border bg-secondary/30">
                        <CardTitle className="text-2xl font-sans font-bold text-foreground">Chip In</CardTitle>
                        <CardDescription className="text-base text-muted-foreground font-sans">
                          Join the surprise. Every bit helps us reach the $300 goal.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            
                            <FormField
                              control={form.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-foreground font-mono uppercase tracking-wider text-xs">Pledge Amount</FormLabel>
                                  <div className="grid grid-cols-3 gap-3 mb-4">
                                    {[10, 20, 50].map((amount) => (
                                      <Button
                                        key={amount}
                                        type="button"
                                        variant={field.value === amount ? "default" : "outline"}
                                        className="h-12 rounded-xl font-mono font-medium text-lg"
                                        onClick={() => handleQuickPick(amount)}
                                      >
                                        ${amount}
                                      </Button>
                                    ))}
                                  </div>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-muted-foreground font-mono text-xl">$</span>
                                      </div>
                                      <Input 
                                        {...field} 
                                        type="number" 
                                        className="pl-8 h-14 rounded-xl text-lg font-mono bg-secondary/50 border-card-border focus-visible:ring-primary focus-visible:border-primary"
                                        data-testid="input-amount"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-destructive font-medium" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center justify-between mb-1">
                                    <FormLabel className="text-foreground font-mono uppercase tracking-wider text-xs">Your Name</FormLabel>
                                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground font-mono">
                                      <Checkbox
                                        checked={isAnonymous}
                                        onCheckedChange={(checked) => {
                                          setIsAnonymous(!!checked);
                                          if (checked) form.setValue("name", "Anonymous", { shouldValidate: true });
                                          else form.setValue("name", "", { shouldValidate: false });
                                        }}
                                        className="rounded"
                                        data-testid="checkbox-anonymous"
                                      />
                                      Go anonymous
                                    </label>
                                  </div>
                                  <FormControl>
                                    <Input 
                                      {...field}
                                      disabled={isAnonymous}
                                      placeholder={isAnonymous ? "Anonymous" : "How David knows you"}
                                      className="h-14 rounded-xl text-base bg-secondary/50 border-card-border focus-visible:ring-primary focus-visible:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                      data-testid="input-name"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-destructive font-medium" />
                                </FormItem>
                              )}
                            />

                            <Button 
                              type="submit" 
                              disabled={createPledge.isPending || isSummaryLoading}
                              className="w-full h-14 text-lg font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(234,142,42,0.3)] hover:shadow-[0_0_30px_rgba(234,142,42,0.5)]"
                              data-testid="button-submit"
                            >
                              {createPledge.isPending ? "Processing..." : "Pledge Now"}
                            </Button>
                            
                            <p className="text-xs text-center text-muted-foreground mt-4 font-mono">
                              You will be given Venmo instructions after submitting.
                            </p>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
