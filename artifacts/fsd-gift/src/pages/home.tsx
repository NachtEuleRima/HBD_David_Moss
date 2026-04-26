import { useState, useEffect, useMemo, useRef } from "react";
import confetti from "canvas-confetti";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useGetPledgeSummary, getGetPledgeSummaryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Gift, Route, Calendar, Heart, CheckCircle2, Lock, Trash2, LogIn, LogOut, CreditCard, ChevronLeft, ChevronUp, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

import carPhoto from "@assets/G9emjJyWcAA2uhm_1775877269348.jpeg";
import davidPhoto from "@assets/IMG_4594_1775877101729.jpeg";
import { ScratchVoucher } from "@/components/ScratchVoucher";

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
    const result = [];
    while (result.length < 320) {
      const cx = Math.random() * 100;
      const cy = Math.random() * 100;
      if (cx > 33 && cx < 67 && cy > 28 && cy < 52) continue;
      result.push({
        id: result.length,
        cx,
        cy,
        r: Math.random() * 0.7 + 0.2,
        color: LIDAR_COLORS[Math.floor(Math.random() * LIDAR_COLORS.length)],
        opacity: Math.random() * 0.55 + 0.45,
      });
    }
    return result;
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/20 h-full min-h-[220px]">
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
          <circle key={dot.id} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.color} opacity={dot.opacity} />
        ))}
      </svg>
    </div>
  );
}

const formSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  amount: z.coerce.number().min(1, "Minimum pledge is $1").max(1500, "Maximum pledge is $1500"),
});

type FormValues = z.infer<typeof formSchema>;

let _cachedStripe: ReturnType<typeof loadStripe> | null = null;
function getStripe(publishableKey: string) {
  if (!_cachedStripe) _cachedStripe = loadStripe(publishableKey);
  return _cachedStripe;
}

const stripeAppearance = {
  theme: "night" as const,
  variables: {
    colorPrimary: "#ea8e2a",
    colorBackground: "#1c1c1e",
    colorText: "#f5f5f5",
    colorDanger: "#ff453a",
    borderRadius: "12px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
};

interface StripePaymentFormProps {
  amount: number;
  name: string;
  baseUrl: string;
  onSuccess: () => void;
  onBack: () => void;
}

function StripePaymentForm({ amount, name, baseUrl, onSuccess, onBack }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);
  const { toast } = useToast();

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setError(null);
    setIsProcessing(true);

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}${window.location.pathname}#pledge-section`,
        },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        const res = await fetch(`${baseUrl}/api/pledges`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });
        if (res.ok) {
          onSuccess();
        } else {
          const data = await res.json().catch(() => ({}));
          toast({
            title: "Payment received",
            description: data.error || "Your payment was received but pledge recording failed. Contact support.",
            variant: "destructive",
          });
          setIsProcessing(false);
        }
      } else {
        setError("Payment was not completed. Please try again.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Pledging</p>
          <p className="text-3xl font-bold font-sans text-foreground tabular-nums">${amount}</p>
          {name !== "Anonymous" && <p className="text-sm text-muted-foreground mt-0.5">as {name}</p>}
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-card-border bg-secondary/20 p-4">
        <PaymentElement
          onReady={() => setIsElementReady(true)}
          onLoadError={() => setIsElementReady(true)}
          options={{
            layout: "tabs",
            wallets: { applePay: "auto", googlePay: "auto" },
          }}
        />
      </div>

      {error && (
        <p className="text-destructive text-sm font-medium rounded-xl bg-destructive/10 px-4 py-3 border border-destructive/20">
          {error}
        </p>
      )}

      <Button
        onClick={handlePay}
        disabled={isProcessing || !stripe || !elements || !isElementReady}
        className="w-full h-14 text-lg font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(234,142,42,0.3)] hover:shadow-[0_0_30px_rgba(234,142,42,0.5)]"
        data-testid="button-pay"
      >
        {!isElementReady ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Loading payment form…
          </span>
        ) : isProcessing ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          `Pay $${amount}`
        )}
      </Button>

      <button
        onClick={onBack}
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
      >
        <ChevronLeft size={14} /> Change amount
      </button>
    </div>
  );
}

let confettiFired = false;

function SmartAvatarImage({
  username,
  storedUrl,
  alt,
}: {
  username?: string | null;
  storedUrl?: string | null;
  alt: string;
}) {
  const candidates = useMemo(() => {
    const list: string[] = [];
    if (username) list.push(`${import.meta.env.BASE_URL}api/avatar/x/${encodeURIComponent(username)}`);
    if (storedUrl) list.push(storedUrl);
    return list;
  }, [username, storedUrl]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [username, storedUrl]);

  if (candidates.length === 0 || idx >= candidates.length) return null;

  return (
    <AvatarImage
      key={candidates[idx]}
      src={candidates[idx]}
      alt={alt}
      onError={() => setIdx((i) => i + 1)}
    />
  );
}

export default function Home() {
  const [formStep, setFormStep] = useState<"form" | "payment" | "success">("form");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [pendingPayment, setPendingPayment] = useState<{ name: string; amount: number } | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [adminPledges, setAdminPledges] = useState<Array<{ id: number; name: string; amount: number; xUsername?: string; createdAt: string }>>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showAllSupporters, setShowAllSupporters] = useState(false);
  const [xUser, setXUser] = useState<{ id: string; username: string; name: string } | null>(null);
  const [xUserLoading, setXUserLoading] = useState(true);
  const [showParty, setShowParty] = useState(!confettiFired);
  const [showGiftNudge, setShowGiftNudge] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: summary, isLoading: isSummaryLoading } = useGetPledgeSummary();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", amount: 42 },
  });

  const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
  const elementsOptions = useMemo(
    () => (clientSecret ? { clientSecret, appearance: stripeAppearance } : undefined),
    [clientSecret],
  );

  useEffect(() => {
    fetch(`${baseUrl}/api/stripe/config`, { credentials: "include" })
      .then((r) => r.json())
      .then(({ publishableKey }) => {
        if (publishableKey) setStripePromise(getStripe(publishableKey));
      })
      .catch(() => {});
  }, [baseUrl]);

  const startPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/me`, { credentials: "include" });
        const { user } = await res.json();
        if (user) {
          clearInterval(pollRef.current!);
          pollRef.current = null;
          setXUser(user);
          setXUserLoading(false);
          form.setValue("name", user.name, { shouldValidate: false });
          setTimeout(() => {
            document.getElementById("pledge-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 300);
        }
      } catch {}
    }, 1500);
    setTimeout(() => {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    }, 180000);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("auth_error");
    if (authError) {
      toast({ title: "Verification failed", description: "Could not verify your identity. Please try again.", variant: "destructive" });
      window.history.replaceState({}, "", window.location.pathname);
    }

    const paymentIntentId = params.get("payment_intent");
    const redirectStatus = params.get("redirect_status");
    if (paymentIntentId && redirectStatus === "succeeded") {
      window.history.replaceState({}, "", window.location.pathname + "#pledge-section");
      fetch(`${baseUrl}/api/pledges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ paymentIntentId }),
      })
        .then((r) => r.json())
        .then(() => setFormStep("success"))
        .catch(() => {
          toast({ title: "Payment received", description: "Your payment went through. Contact support if your pledge wasn't recorded.", variant: "destructive" });
        });
    } else if (paymentIntentId && redirectStatus && redirectStatus !== "succeeded") {
      window.history.replaceState({}, "", window.location.pathname);
      toast({ title: "Payment incomplete", description: "The payment was not completed. Please try again.", variant: "destructive" });
    }

    fetch(`${baseUrl}/api/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then(({ user }) => {
        if (user) {
          setXUser(user);
          form.setValue("name", user.name, { shouldValidate: false });
        }
      })
      .catch(() => {})
      .finally(() => setXUserLoading(false));

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    if (xUserLoading) return;
    if (window.location.hash !== "#pledge-section") return;
    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById("pledge-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState({}, "", window.location.pathname + window.location.search);
      } else if (attempts < 8) {
        attempts++;
        setTimeout(tryScroll, 150);
      }
    };
    setTimeout(tryScroll, 100);
  }, [xUserLoading]);

  const onSubmit = async (values: FormValues) => {
    const name = isAnonymous ? "Anonymous" : values.name;
    setIsCreatingIntent(true);
    try {
      const res = await fetch(`${baseUrl}/api/stripe/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: values.amount, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initialize payment");
      setClientSecret(data.clientSecret);
      setPendingPayment({ name, amount: values.amount });
      setFormStep("payment");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Please try again", variant: "destructive" });
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: getGetPledgeSummaryQueryKey() });
    setFormStep("success");
  };

  const handleQuickPick = (amount: number) => {
    form.setValue("amount", amount, { shouldValidate: true });
  };

  const fetchAdminPledges = (pwd: string) =>
    fetch(`${baseUrl}/api/pledges/summary`, {
      headers: { "x-admin-password": pwd },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => { setAdminPledges(data.pledges ?? []); });

  useEffect(() => {
    if (isAdminMode && adminPassword) {
      fetchAdminPledges(adminPassword);
    }
  }, [summary, isAdminMode, adminPassword]);

  useEffect(() => {
    if (confettiFired) return;
    confettiFired = true;
    setTimeout(() => {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { x: 0.5, y: 0.5 },
        startVelocity: 42,
        gravity: 1.4,
        scalar: 0.9,
        ticks: 240,
        colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6bdb", "#ffffff", "#ffab40"],
      });
    }, 100);
    setTimeout(() => setShowParty(false), 2400);
    setTimeout(() => setShowGiftNudge(true), 2800);
    setTimeout(() => setShowGiftNudge(false), 9200);
  }, []);

  const handleAdminLogin = () => {
    if (adminInput !== "cyberowlcanaccess") {
      setAdminError(true);
      return;
    }
    fetch(`${baseUrl}/api/pledges/summary`, {
      headers: { "x-admin-password": adminInput },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        setAdminPassword(adminInput);
        setAdminPledges(data.pledges ?? []);
        setIsAdminMode(true);
        setShowAdminLogin(false);
        setAdminInput("");
        setAdminError(false);
      })
      .catch(() => setAdminError(true));
  };

  const openContact = (username: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `twitter://user?screen_name=${username}`;
    } else {
      window.open(`https://x.com/${username}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${baseUrl}/api/pledges/${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": "cyberowlcanaccess" },
      });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: getGetPledgeSummaryQueryKey() });
        toast({ title: "Supporter removed" });
      } else {
        toast({ title: "Failed to remove", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const progressPercentage = summary ? Math.min((summary.total / summary.goalAmount) * 100, 100) : 0;

  return (
    <div className="min-h-[100dvh] w-full bg-background selection:bg-primary/30">
      <AnimatePresence>
        {showParty && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.18, 1] }}
              transition={{ duration: 0.35, ease: "easeOut", times: [0, 0.65, 1] }}
              className="select-none"
              style={{ fontSize: "7rem", lineHeight: 1 }}
            >
              🎉
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed top-4 right-[18px] z-40 w-9 h-9 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm text-primary hover:bg-primary/30 transition-all flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      {/* Scroll to bottom button */}
      <button
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
        className="fixed bottom-4 right-[18px] z-40 w-9 h-9 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm text-primary hover:bg-primary/30 transition-all flex items-center justify-center"
        aria-label="Scroll to bottom"
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-end justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <img
            src={carPhoto}
            alt="David Moss with his Tesla at a Supercharger"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)] pointer-events-none mix-blend-multiply" />
        </div>

        <div className="relative z-10 container px-4 md:px-6 mx-auto text-center flex flex-col items-center pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <AnimatePresence>
                {showGiftNudge && (
                  <motion.span
                    key="nudge-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: [0, 7, -2, 5, 0] }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                    transition={{ opacity: { duration: 0.3 }, x: { duration: 1.2, repeat: 2, repeatDelay: 0.9, ease: "easeInOut" } }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 15, userSelect: "none", color: "#00e5f5" }}
                  >
                    🎁<span style={{ fontSize: 12, opacity: 0.85 }}>→</span>
                  </motion.span>
                )}
              </AnimatePresence>
              <div style={{ position: "relative", display: "inline-flex" }}>
                <AnimatePresence>
                  {showGiftNudge && (
                    <motion.span
                      key="ring"
                      initial={{ opacity: 0 }}
                      animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0, 0.55] }}
                      exit={{ opacity: 0, transition: { duration: 0.4 } }}
                      transition={{ duration: 2, repeat: 3, ease: "easeInOut" }}
                      style={{
                        position: "absolute", inset: -4, borderRadius: 99,
                        border: "1.5px solid rgba(0,229,245,0.65)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </AnimatePresence>
                <motion.button
                  whileHover={{ scale: 1.07, boxShadow: "0 0 18px rgba(0,229,245,0.45)" }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => document.getElementById("voucher-section")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium backdrop-blur-sm cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>April 26th Birthday Surprise</span>
                </motion.button>
              </div>
              <AnimatePresence>
                {showGiftNudge && (
                  <motion.span
                    key="nudge-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: [0, -7, 2, -5, 0] }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                    transition={{ opacity: { duration: 0.3 }, x: { duration: 1.2, repeat: 2, repeatDelay: 0.9, ease: "easeInOut" } }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 15, userSelect: "none", color: "#00e5f5" }}
                  >
                    <span style={{ fontSize: 12, opacity: 0.85 }}>←</span>🎁
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4 font-sans drop-shadow-lg">
              For David Moss.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Celebrating a legend who completed the very first solo coast-to-coast drive on 100% Tesla Full Self-Driving. Let's surprise him with a custom-built NAS for his content creator journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container px-4 md:px-6 lg:px-12 mx-auto py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Story & Progress */}
          <div className="lg:col-span-8 space-y-12">

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
              <div className="flex flex-col sm:flex-row gap-6 items-stretch">
                <div className="w-full sm:w-48 lg:w-64 flex-shrink-0 self-stretch">
                  <LidarPhoto />
                </div>
                <div className="prose prose-invert prose-lg text-muted-foreground font-sans">
                  <p>
                    Driving coast-to-coast is an achievement. Doing it entirely on Tesla's Full Self-Driving is a milestone (and so is turning 30) in the history of transportation. David Moss did exactly that — a LiDAR salesman who allegedly™ believes in a vision-only future, proving what's possible when conviction meets determination.
                  </p>
                  <p>
                    As a core member of the Tesla community, David is always sharing insights and pushing the boundaries, whether it's him jumping in front of unsupervised Tesla Robotaxis or testing FSD v14.3.x. For his birthday on April 26th, we're coming together to get him something that powers his content creator journey: <strong className="text-primary/75 font-semibold">a custom-built NAS (Network Attached Storage)</strong> he can access from anywhere — a pro-grade, remote-accessible storage system worthy of the FSD Knight.
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
                        / ${summary?.goalAmount || 1500}
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
                <div
                  role="progressbar"
                  aria-valuenow={summary?.total || 0}
                  aria-valuemin={0}
                  aria-valuemax={summary?.goalAmount || 1500}
                  aria-label={`Fundraising progress: $${summary?.total || 0} raised out of $${summary?.goalAmount || 1500} goal`}
                  className="relative h-4 bg-secondary rounded-full overflow-hidden my-6"
                >
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
                    <span>{summary?.count || 0} {summary?.count === 1 ? "supporter has" : "supporters have"} chipped in</span>
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground font-sans">Supporters</h3>
                <button
                  onClick={() => { if (isAdminMode) { setIsAdminMode(false); } else { setShowAdminLogin((v) => !v); setAdminError(false); } }}
                  className="text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
                  title="Admin"
                >
                  <Lock size={14} />
                </button>
              </div>
              {showAdminLogin && !isAdminMode && (
                <div className="mb-4 flex gap-2 items-center">
                  <input
                    type="password"
                    value={adminInput}
                    onChange={(e) => { setAdminInput(e.target.value); setAdminError(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                    placeholder="Admin password"
                    className={`flex-1 h-9 px-3 rounded-lg text-sm bg-secondary/50 border ${adminError ? "border-destructive" : "border-card-border"} text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary`}
                  />
                  <button
                    onClick={handleAdminLogin}
                    className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Enter
                  </button>
                </div>
              )}
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
              ) : (isAdminMode ? adminPledges : summary?.pledges ?? []).length > 0 ? (
                (() => {
                  const allPledges = isAdminMode ? adminPledges : summary?.pledges ?? [];
                  const sorted = isAdminMode ? allPledges : [...allPledges].sort((a, b) => Number(b.amount) - Number(a.amount));
                  const visible = isAdminMode || showAllSupporters ? sorted : sorted.slice(0, 4);
                  const hasMore = !isAdminMode && sorted.length > 4;
                  return (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {visible.map((pledge) => (
                          <div key={pledge.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-card-border">
                            <Avatar className="h-12 w-12 border border-card-border shadow-sm flex-shrink-0">
                              <SmartAvatarImage
                                username={(pledge as any).xUsername}
                                storedUrl={(pledge as any).xAvatarUrl}
                                alt={(pledge as any).xUsername || pledge.name}
                              />
                              <AvatarFallback className="bg-secondary text-secondary-foreground font-mono font-bold">
                                {pledge.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground font-sans truncate">{pledge.name}</p>
                              <p className="text-sm text-primary font-mono font-medium">${pledge.amount}</p>
                              {isAdminMode && (pledge as any).xUsername && (
                                <p className="text-xs text-cyan-400 font-mono mt-0.5">@{(pledge as any).xUsername}</p>
                              )}
                            </div>
                            {isAdminMode && (
                              <button
                                onClick={() => handleDelete(pledge.id)}
                                disabled={deletingId === pledge.id}
                                className="ml-auto text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40 flex-shrink-0"
                                title="Remove supporter"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {hasMore && (
                        <button
                          onClick={() => setShowAllSupporters((v) => !v)}
                          className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2 rounded-xl hover:bg-secondary/50 border border-transparent hover:border-card-border font-mono"
                        >
                          {showAllSupporters ? "Show less" : `See all ${sorted.length} supporters`}
                        </button>
                      )}
                    </>
                  );
                })()
              ) : (
                <p className="text-muted-foreground italic">Be the first to chip in!</p>
              )}
            </motion.section>

          </div>

          {/* Right Column: Form / Action */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-8">
              <AnimatePresence mode="wait">
                {summary?.goalReached && formStep !== "success" ? (
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
                        We did it! Thank you to everyone who chipped in for David's custom NAS build. What an amazing community.
                      </p>
                    </div>
                  </motion.div>
                ) : formStep === "success" ? (
                  /* Success State */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border border-primary/20 rounded-3xl p-8 shadow-2xl shadow-primary/5 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-sans text-foreground">Pledge Complete!</h3>
                      <p className="text-muted-foreground">
                        Thank you! Your payment was received and your pledge for David has been recorded. Happy birthday to the FSD Knight! 🎉
                      </p>
                    </div>
                    {pendingPayment && (
                      <div className="bg-secondary/50 rounded-2xl p-4 border border-card-border text-center">
                        <p className="text-3xl font-bold text-primary font-mono">${pendingPayment.amount}</p>
                        <p className="text-sm text-muted-foreground mt-1">from {pendingPayment.name}</p>
                      </div>
                    )}
                  </motion.div>
                ) : formStep === "payment" && clientSecret && stripePromise ? (
                  /* Payment Step */
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card id="pledge-section" className="border-card-border bg-card shadow-2xl rounded-3xl overflow-hidden">
                      <CardHeader className="pb-6 border-b border-card-border bg-secondary/30">
                        <CardTitle className="text-2xl font-sans font-bold text-foreground">Complete Payment</CardTitle>
                        <CardDescription className="text-base text-muted-foreground font-sans">
                          Secure payment powered by Stripe. Supports Apple Pay, Google Pay & cards.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <Elements
                          key={clientSecret}
                          stripe={stripePromise}
                          options={elementsOptions}
                        >
                          <StripePaymentForm
                            amount={pendingPayment?.amount ?? 0}
                            name={pendingPayment?.name ?? ""}
                            baseUrl={baseUrl}
                            onSuccess={handlePaymentSuccess}
                            onBack={() => { setFormStep("form"); setClientSecret(null); }}
                          />
                        </Elements>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  /* Form Step */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card id="pledge-section" className="border-card-border bg-card shadow-2xl rounded-3xl overflow-hidden">
                      <CardHeader className="pb-6 border-b border-card-border bg-secondary/30">
                        <CardTitle className="text-2xl font-sans font-bold text-foreground">Chip In</CardTitle>
                        <CardDescription className="text-base text-muted-foreground font-sans">
                          Join the mission. Every bit helps us reach the $1,500 goal.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {xUserLoading ? (
                          <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : !xUser ? (
                          <div className="flex flex-col items-center gap-4 py-8 text-center">
                            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                              <LogIn className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground font-sans">Verify your identity to chip in</p>
                            </div>
                            <a
                              href={`${baseUrl}/api/auth/x/login-redirect`}
                              className="w-full h-12 rounded-xl bg-[#000000] hover:bg-[#1a1a1a] text-white font-semibold flex items-center gap-2 justify-center"
                            >
                              Authorize with
                              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between mb-5 px-1">
                              <span className="text-xs text-muted-foreground font-mono">
                                Signed in as <span className="text-primary">@{xUser.username}</span>
                              </span>
                              <button
                                onClick={() => fetch(`${baseUrl}/api/auth/logout`, { method: "POST", credentials: "include" }).then(() => { setXUser(null); form.setValue("name", ""); })}
                                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                              >
                                <LogOut size={12} /> Disconnect
                              </button>
                            </div>
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                  control={form.control}
                                  name="amount"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-foreground font-mono uppercase tracking-wider text-xs">Pledge Amount</FormLabel>
                                      <div className="grid grid-cols-3 gap-3 mb-4">
                                        {[42, 69, 420].map((amount) => (
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
                                              else form.setValue("name", xUser?.name || "", { shouldValidate: false });
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
                                  disabled={isCreatingIntent || isSummaryLoading}
                                  className="w-full h-14 text-lg font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(234,142,42,0.3)] hover:shadow-[0_0_30px_rgba(234,142,42,0.5)]"
                                  data-testid="button-submit"
                                >
                                  {isCreatingIntent ? (
                                    <span className="flex items-center gap-2">
                                      <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                      Preparing payment...
                                    </span>
                                  ) : "Pledge & Pay"}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-4 font-mono">
                                  Secured by Stripe · Apple Pay & cards accepted
                                </p>
                              </form>
                            </Form>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {/* Scratch Voucher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <ScratchVoucher />
        </motion.div>

        {/* Video Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <p style={{ textAlign: "center", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "#5d7a90", marginBottom: 14, fontFamily: "'Space Grotesk', monospace" }}>
            See it in action
          </p>
          <div
            onClick={() => setVideoOpen(true)}
            style={{
              position: "relative", borderRadius: 16, overflow: "hidden",
              cursor: "pointer", maxWidth: 480, margin: "0 auto",
              background: "#0d1829",
              border: "1px solid rgba(0,229,245,0.18)",
              boxShadow: "0 0 24px rgba(0,229,245,0.08)",
              aspectRatio: "16/9",
            }}
          >
            {/* Gradient background behind NAS */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 60% 55%, #0d2a3a 0%, #071628 55%, #020c18 100%)",
            }} />
            <video
              src={`${baseUrl}/api/video/david-fsd-video.mp4`}
              poster="/nas-cover-clean.png"
              muted playsInline preload="metadata"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 53%", display: "block", pointerEvents: "none", position: "relative" }}
            />
            {/* Dark overlay */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(7,16,31,0.38)" }} />
            {/* Play button */}
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "rgba(0,229,245,0.18)",
                  border: "2px solid rgba(0,229,245,0.7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 0 28px rgba(0,229,245,0.30)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#00e5f5">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Video Modal */}
        <AnimatePresence>
          {videoOpen && (
            <motion.div
              key="video-modal"
              role="dialog"
              aria-modal="true"
              aria-label="David Moss FSD video — swipe down or press Escape to close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVideoOpen(false)}
              onKeyDown={(e) => { if (e.key === "Escape") setVideoOpen(false); }}
              style={{
                position: "fixed", inset: 0, zIndex: 9999,
                background: "rgba(0,0,0,0.88)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(8px)",
              }}
            >
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 120, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.05, bottom: 0.4 }}
                onDragEnd={(_e, info) => { if (info.offset.y > 80) setVideoOpen(false); }}
                onClick={e => e.stopPropagation()}
                style={{
                  position: "relative", borderRadius: 20, overflow: "hidden",
                  width: "min(88vw, 420px)",
                  aspectRatio: "9/16",
                  background: "#000",
                  boxShadow: "0 0 60px rgba(0,229,245,0.18)",
                  border: "1px solid rgba(0,229,245,0.22)",
                  cursor: "grab",
                  touchAction: "none",
                }}
              >
                {/* Swipe handle */}
                <div style={{
                  position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
                  width: 36, height: 4, borderRadius: 2,
                  background: "rgba(255,255,255,0.35)", zIndex: 10, pointerEvents: "none",
                }} />
                {/* VoiceOver-accessible close button — visually hidden */}
                <button
                  onClick={() => setVideoOpen(false)}
                  aria-label="Close video"
                  style={{
                    position: "absolute", top: 0, right: 0, width: 1, height: 1,
                    overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap",
                    zIndex: 20,
                  }}
                />
                <video
                  src={`${baseUrl}/api/video/david-fsd-video.mp4`}
                  autoPlay controls playsInline
                  aria-label="David Moss Tesla FSD coast-to-coast drive video"
                  onEnded={() => setVideoOpen(false)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tech Support Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 pt-12 border-t border-border"
        >
          <style>{`
            @keyframes neonFlicker {
              0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
                opacity: 1;
                text-shadow: 0 0 8px #ea8e2a, 0 0 20px #ea8e2a, 0 0 40px #ea8e2a;
              }
              20%, 24%, 55% {
                opacity: 0.4;
                text-shadow: none;
              }
            }
          `}</style>

          <div className="text-center mb-10">
            <span
              className="inline-block text-2xl md:text-3xl font-black font-mono tracking-[0.25em] uppercase text-primary"
              style={{ animation: "neonFlicker 3s infinite" }}
            >
              ⚡ TECH SUPPORT ⚡
            </span>
            <p className="text-muted-foreground mt-3 text-sm font-sans">Have a question? Reach out to the right person below.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a
              href="#"
              onClick={openContact("RimaSukhadia")}
              className="group flex flex-col items-center gap-4 p-6 rounded-3xl bg-card border border-card-border hover:border-primary/40 hover:shadow-[0_0_24px_rgba(234,142,42,0.15)] transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-secondary border-2 border-card-border group-hover:border-primary/50 transition-colors overflow-hidden relative flex items-center justify-center">
                <img
                  src="https://unavatar.io/twitter/RimaSukhadia"
                  alt="RimaSukhadia"
                  className="w-full h-full object-cover absolute inset-0"
                  onError={(e) => { e.currentTarget.style.display = "none"; (e.currentTarget.nextSibling as HTMLElement).style.display = "block"; }}
                />
                <svg viewBox="0 0 24 24" className="hidden w-7 h-7 fill-muted-foreground group-hover:fill-primary transition-colors" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground font-sans text-lg">📐_Cyber_Owl_🦉</p>
                <p className="text-sm text-primary font-mono">@RimaSukhadia</p>
                <p className="text-xs text-muted-foreground mt-2 font-sans">Website &amp; technical inquiries</p>
              </div>
              <span className="text-xs text-muted-foreground/60 group-hover:text-primary font-mono transition-colors">Message on X →</span>
            </a>

            <a
              href="#"
              onClick={openContact("koby_pierce")}
              className="group flex flex-col items-center gap-4 p-6 rounded-3xl bg-card border border-card-border hover:border-primary/40 hover:shadow-[0_0_24px_rgba(234,142,42,0.15)] transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-secondary border-2 border-card-border group-hover:border-primary/50 transition-colors overflow-hidden relative flex items-center justify-center">
                <img
                  src="https://unavatar.io/twitter/koby_pierce"
                  alt="koby_pierce"
                  className="w-full h-full object-cover absolute inset-0"
                  onError={(e) => { e.currentTarget.style.display = "none"; (e.currentTarget.nextSibling as HTMLElement).style.display = "block"; }}
                />
                <svg viewBox="0 0 24 24" className="hidden w-7 h-7 fill-muted-foreground group-hover:fill-primary transition-colors" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground font-sans text-lg">Koby Pierce</p>
                <p className="text-sm text-primary font-mono">@koby_pierce</p>
                <p className="text-xs text-muted-foreground mt-2 font-sans">NAS gift inquiries</p>
              </div>
              <span className="text-xs text-muted-foreground/60 group-hover:text-primary font-mono transition-colors">Message on X →</span>
            </a>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
