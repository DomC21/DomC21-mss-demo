import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Phone, Mail, MapPin, Clock, DollarSign, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// Removed unused imports
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  customerName: z.string().min(2, 'Please enter a valid name (minimum 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number'),
  address: z.string().min(5, 'Please enter a complete address'),
  preferredCommunication: z.enum(['email', 'phone', 'text']),
  serviceType: z.enum(['moving', 'packing', 'storage', 'cleaning']),
  requestedDateTime: z.string().min(1, 'Please select a date and time'),
  specialNotes: z.string().optional(),
  estimatedValue: z.number()
    .min(100, 'Minimum order value is $100')
    .max(100000, 'For orders over $100,000, please contact us directly'),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  {
    title: 'Personal Information',
    description: 'Tell us about yourself',
    fields: ['customerName', 'email', 'phone', 'address', 'preferredCommunication'],
  },
  {
    title: 'Service Details',
    description: 'What service do you need?',
    fields: ['serviceType', 'requestedDateTime', 'estimatedValue', 'specialNotes'],
  },
];

export function OrderIntakeForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      address: '',
      preferredCommunication: 'email',
      serviceType: 'moving',
      requestedDateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      specialNotes: '',
      estimatedValue: 1000,
    },
  });

  // Track form completion for each step
  const [stepCompletion, setStepCompletion] = useState<Record<number, boolean>>({
    0: false, // Personal Information
    1: false  // Service Details
  });

  // Update step completion status
  useEffect(() => {
    const personalInfoFields = ['customerName', 'email', 'phone', 'address'] as const;
    const serviceDetailsFields = ['serviceType', 'requestedDateTime', 'estimatedValue'] as const;
    
    const personalInfoComplete = personalInfoFields.every(field => {
      const fieldState = form.getFieldState(field);
      return fieldState.isDirty && !fieldState.error;
    });

    const serviceDetailsComplete = serviceDetailsFields.every(field => {
      const fieldState = form.getFieldState(field);
      return fieldState.isDirty && !fieldState.error;
    });

    setStepCompletion(prev => ({
      ...prev,
      0: personalInfoComplete,
      1: serviceDetailsComplete
    }));
  }, [form]);

  const onSubmit = async (data: FormData) => {
    // In a real app, this would make an API call
    console.log('Form submitted:', data);
    setIsSubmitted(true);
  };

  // const currentFields = steps[currentStep].fields;

  if (isSubmitted) {
    return (
      <div className="container max-w-2xl mx-auto section-spacing">
        <Alert className="bg-green-50/80 border-green-200 shadow-sm hover:shadow-card-hover transition-all duration-200 dark:bg-green-950/30 dark:border-green-900">
          <div className="flex items-start gap-6">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/50">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            </div>
            <div className="space-y-4">
              <AlertTitle className="text-2xl font-semibold tracking-tight text-green-800 dark:text-green-300">
                Order Received Successfully!
              </AlertTitle>
              <AlertDescription className="text-base leading-relaxed text-green-700/90 dark:text-green-400/90">
                Thank you for choosing MSS. We will contact you within 24 hours to confirm your appointment details.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto section-spacing">
      <div className="relative pb-20">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={cn(
                "flex-1 relative",
                index < steps.length - 1 ? "border-t-2" : "",
                index < currentStep 
                  ? "border-primary" 
                  : index === currentStep
                  ? "border-primary/70"
                  : "border-input/40 dark:border-input/20"
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-xl font-semibold tracking-tight transition-all duration-200",
                  "border-2 shadow-sm",
                  index < currentStep
                    ? "bg-primary text-primary-foreground border-primary shadow-primary/20"
                    : index === currentStep
                    ? stepCompletion[index]
                      ? "bg-primary text-primary-foreground border-primary shadow-primary/20"
                      : "bg-primary/10 text-primary border-primary/50"
                    : "bg-background text-muted-foreground/70 border-input/40 dark:border-input/20"
                )}
              >
                {index + 1}
              </div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center w-full">
                <span 
                  className={cn(
                    "text-sm font-medium tracking-tight whitespace-nowrap transition-colors duration-200",
                    index < currentStep
                      ? "text-primary font-semibold"
                      : index === currentStep
                      ? stepCompletion[index]
                        ? "text-primary font-semibold"
                        : "text-primary/90"
                      : "text-muted-foreground/60"
                  )}
                >
                  {step.title}
                </span>
                <p className="text-xs text-muted-foreground/60 mt-1.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
        <CardHeader className="space-y-4 pb-8">
          <CardTitle className="text-3xl font-semibold tracking-tight leading-tight">{steps[currentStep].title}</CardTitle>
          <CardDescription className="text-base text-muted-foreground/90 leading-relaxed">{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={form.handleSubmit(onSubmit)} className="content-spacing">
            {currentStep === 0 && (
              <>
                <div className="form-group">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input
                    id="customerName"
                    {...form.register('customerName')}
                    className={cn(
                      "h-11 transition-colors focus-visible:ring-1 focus:ring-primary border-input/50",
                      form.formState.errors.customerName ? 'border-destructive focus:ring-destructive' : ''
                    )}
                  />
                  {form.formState.errors.customerName && (
                    <div className="mt-2.5 rounded-md bg-destructive/5 px-3.5 py-2.5 text-destructive border border-destructive/10">
                      <p className="text-sm font-medium leading-snug flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive inline-block flex-shrink-0" />
                        {form.formState.errors.customerName.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      className={cn(
                        "pl-10 h-11 transition-colors focus-visible:ring-1 focus:ring-primary border-input/50",
                        form.formState.errors.email ? 'border-destructive focus:ring-destructive' : ''
                      )}
                      {...form.register('email')}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <div className="mt-2.5 rounded-md bg-destructive/5 px-3.5 py-2.5 text-destructive border border-destructive/10">
                      <p className="text-sm font-medium leading-snug flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive inline-block flex-shrink-0" />
                        {form.formState.errors.email.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      id="phone"
                      type="tel"
                      className={cn(
                        "pl-10 h-11 transition-colors focus-visible:ring-1 focus:ring-primary border-input/50",
                        form.formState.errors.phone ? 'border-destructive focus:ring-destructive' : ''
                      )}
                      {...form.register('phone')}
                    />
                  </div>
                  {form.formState.errors.phone && (
                    <div className="mt-2.5 rounded-md bg-destructive/5 px-3.5 py-2.5 text-destructive border border-destructive/10">
                      <p className="text-sm font-medium leading-snug flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive inline-block flex-shrink-0" />
                        {form.formState.errors.phone.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      id="address"
                      className={cn(
                        "pl-10 h-11 transition-colors focus-visible:ring-1 focus:ring-primary border-input/50",
                        form.formState.errors.address ? 'border-destructive focus:ring-destructive' : ''
                      )}
                      {...form.register('address')}
                    />
                  </div>
                  {form.formState.errors.address && (
                    <div className="mt-2.5 rounded-md bg-destructive/5 px-3.5 py-2.5 text-destructive border border-destructive/10">
                      <p className="text-sm font-medium leading-snug flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive inline-block flex-shrink-0" />
                        {form.formState.errors.address.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <Label>Preferred Communication Method</Label>
                  <RadioGroup
                    defaultValue="email"
                    {...form.register('preferredCommunication')}
                    className="mt-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3 rounded-md border border-input/50 p-3 hover:bg-accent/5 transition-colors">
                        <RadioGroupItem value="email" id="email" className="h-5 w-5" />
                        <Label htmlFor="email" className="cursor-pointer text-sm font-medium">Email</Label>
                      </div>
                      <div className="flex items-center space-x-3 rounded-md border border-input/50 p-3 hover:bg-accent/5 transition-colors">
                        <RadioGroupItem value="phone" id="phone" className="h-5 w-5" />
                        <Label htmlFor="phone" className="cursor-pointer text-sm font-medium">Phone</Label>
                      </div>
                      <div className="flex items-center space-x-3 rounded-md border border-input/50 p-3 hover:bg-accent/5 transition-colors">
                        <RadioGroupItem value="text" id="text" className="h-5 w-5" />
                        <Label htmlFor="text" className="cursor-pointer text-sm font-medium">Text</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div className="form-group">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { value: 'moving', label: 'Moving Service', description: 'Professional relocation services for homes and offices' },
                      { value: 'packing', label: 'Packing Service', description: 'Expert packing and unpacking solutions' },
                      { value: 'storage', label: 'Storage Service', description: 'Secure storage facilities for your belongings' },
                      { value: 'cleaning', label: 'Cleaning Service', description: 'Thorough move-in/move-out cleaning' }
                    ].map(service => (
                      <div
                        key={service.value}
                        className={cn(
                          "flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all",
                          "hover:border-primary/50 hover:bg-primary/5",
                          form.watch('serviceType') === service.value
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-input/50"
                        )}
                        onClick={() => form.setValue('serviceType', service.value as 'moving' | 'packing' | 'storage' | 'cleaning')}
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem
                            checked={form.watch('serviceType') === service.value}
                            value={service.value}
                            id={service.value}
                            className="h-5 w-5 mt-0.5"
                          />
                          <div>
                            <Label htmlFor={service.value} className="cursor-pointer font-medium">
                              {service.label}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="requestedDateTime">Requested Date & Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      id="requestedDateTime"
                      type="datetime-local"
                      className={cn(
                        "pl-10 h-11 transition-colors focus-visible:ring-1 focus:ring-primary border-input/50",
                        form.formState.errors.requestedDateTime ? 'border-destructive focus:ring-destructive' : ''
                      )}
                      {...form.register('requestedDateTime')}
                    />
                  </div>
                  {form.formState.errors.requestedDateTime && (
                    <div className="mt-2.5 rounded-md bg-destructive/5 px-3.5 py-2.5 text-destructive border border-destructive/10">
                      <p className="text-sm font-medium leading-snug flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive inline-block flex-shrink-0" />
                        {form.formState.errors.requestedDateTime.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="estimatedValue">Estimated Order Value</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      id="estimatedValue"
                      type="number"
                      min="100"
                      step="100"
                      placeholder="Enter estimated value"
                      className={cn(
                        "pl-10 h-11 transition-colors focus-visible:ring-1 focus:ring-primary border-input/50",
                        form.formState.errors.estimatedValue ? 'border-destructive focus:ring-destructive' : ''
                      )}
                      {...form.register('estimatedValue', { valueAsNumber: true })}
                    />
                  </div>
                  {form.formState.errors.estimatedValue && (
                    <div className="mt-2.5 rounded-md bg-destructive/5 px-3.5 py-2.5 text-destructive border border-destructive/10">
                      <p className="text-sm font-medium leading-snug flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive inline-block flex-shrink-0" />
                        {form.formState.errors.estimatedValue.message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="specialNotes">Special Notes</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
                    <Textarea
                      id="specialNotes"
                      className={cn(
                        "pl-10 min-h-[120px] transition-colors resize-none focus-visible:ring-1 focus:ring-primary border-input/50 shadow-sm",
                        form.formState.errors.specialNotes ? 'border-destructive focus:ring-destructive' : ''
                      )}
                      placeholder="Add any special requirements or notes about your service needs..."
                      {...form.register('specialNotes')}
                    />
                  </div>
                  {form.formState.errors.specialNotes && (
                    <div className="mt-2 rounded-sm bg-destructive/5 px-3 py-2 text-destructive">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive inline-block flex-shrink-0" />
                        {form.formState.errors.specialNotes.message}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-between pt-12 mt-12 border-t border-input/50 dark:border-input/30">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="font-medium tracking-tight min-w-[180px] h-14 shadow-sm hover:shadow-card transition-all duration-200"
                  onClick={() => setCurrentStep(current => current - 1)}
                >
                  ← Previous Step
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  size="lg"
                  className="ml-auto font-medium tracking-tight min-w-[180px] h-14 shadow-sm hover:shadow-card transition-all duration-200"
                  onClick={async () => {
                    const currentFields = steps[currentStep].fields;
                    const isStepValid = await form.trigger(currentFields as (keyof FormData)[]);
                    if (isStepValid) {
                      setCurrentStep(current => current + 1);
                    }
                  }}
                >
                  Next Step →
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  size="lg"
                  className="ml-auto font-medium tracking-tight min-w-[180px] h-14 shadow-sm hover:shadow-card transition-all duration-200"
                >
                  Submit Order →
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
