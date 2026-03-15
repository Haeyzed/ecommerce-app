"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CloudUpload } from "lucide-react"
import { toast } from "sonner"

import { ValidationError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { Input } from "@/components/ui/input"
import {
  PhoneInput,
  PhoneInputCountrySelect,
  PhoneInputField,
} from "@/components/ui/phone-input"
import { Spinner } from "@/components/ui/spinner"
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrev,
  type StepperProps,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"

import { useRegister } from "../api"
import { registerSchema, type RegisterFormData } from "../schemas"
import { CropperFileUpload } from "@/components/cropper-file-upload"

const STEPS = [
  {
    value: "account",
    title: "Account",
    description: "Your basic account details",
    fields: ["name", "email", "username"] as const,
  },
  {
    value: "profile",
    title: "Profile",
    description: "Optional profile and photo",
    fields: ["phone", "company_name", "image"] as const,
  },
  {
    value: "security",
    title: "Security",
    description: "Choose a secure password",
    fields: ["password", "password_confirmation"] as const,
  },
] as const

export function RegisterForm() {
  const [step, setStep] = React.useState("account")
  const { mutateAsync: registerUser, isPending } = useRegister()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      image: [],
      phone: "",
      company_name: "",
      password: "",
      password_confirmation: "",
    },
  })

  const stepIndex = STEPS.findIndex((s) => s.value === step)

  const onValidate: NonNullable<StepperProps["onValidate"]> = React.useCallback(
    async (_value, direction) => {
      if (direction === "prev") return true
      const stepData = STEPS.find((s) => s.value === step)
      if (!stepData) return true
      const isValid = await form.trigger(
        stepData.fields as unknown as (keyof RegisterFormData)[]
      )
      if (!isValid) {
        toast.info("Please complete all required fields to continue")
      }
      return isValid
    },
    [form, step]
  )

  const onSubmit = React.useCallback(
    async (data: RegisterFormData) => {
      try {
        await registerUser(data)
      } catch (error) {
        if (error instanceof ValidationError && error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            form.setError(field as keyof RegisterFormData, {
              type: "server",
              message: (messages as string[])?.[0] ?? "Invalid",
            })
          })
        }
      }
    },
    [registerUser, form]
  )

  return (
    <form
      id="register"
      className="w-full"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Stepper value={step} onValueChange={setStep} onValidate={onValidate}>
        <StepperList>
          {STEPS.map((s) => (
            <StepperItem key={s.value} value={s.value}>
              <StepperTrigger>
                <StepperIndicator />
                <div className="flex flex-col gap-px">
                  <StepperTitle>{s.title}</StepperTitle>
                  <StepperDescription>{s.description}</StepperDescription>
                </div>
              </StepperTrigger>
              <StepperSeparator className="mx-4" />
            </StepperItem>
          ))}
        </StepperList>

        <StepperContent value="account">
          <FieldGroup className="space-y-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="register-name">
                    Full name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="register-name"
                    placeholder="John Doe"
                    autoComplete="name"
                    disabled={isPending}
                    {...field}
                    value={field.value ?? ""}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="register-email">Email</FieldLabel>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    disabled={isPending}
                    {...field}
                    value={field.value ?? ""}
                  />
                  <FieldDescription>
                    Provide email or username below (at least one).
                  </FieldDescription>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="register-username">Username</FieldLabel>
                  <Input
                    id="register-username"
                    placeholder="john_doe"
                    autoComplete="username"
                    disabled={isPending}
                    {...field}
                    value={field.value ?? ""}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </StepperContent>

        <StepperContent value="profile">
          <FieldGroup className="space-y-4">
            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="register-phone">Phone</FieldLabel>
                  <PhoneInput
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    defaultCountry="US"
                    placeholder="Enter phone number"
                    disabled={isPending}
                    invalid={!!fieldState.error}
                  >
                    <PhoneInputCountrySelect />
                    <PhoneInputField id="register-phone" />
                  </PhoneInput>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="company_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="register-company">
                    Company name
                  </FieldLabel>
                  <Input
                    id="register-company"
                    placeholder="Acme Inc."
                    autoComplete="organization"
                    disabled={isPending}
                    {...field}
                    value={field.value ?? ""}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="image"
              render={({ field: { value, onChange }, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="register-image">Avatar</FieldLabel>
                  <CropperFileUpload
                    value={value ?? []}
                    onValueChange={onChange}
                    accept="image/*"
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    onFileReject={(_file, message) => {
                      form.setError("image", { message })
                    }}
                  />
                  <FieldDescription>
                    JPEG, PNG, JPG, GIF, or WebP. Max 5MB.
                  </FieldDescription>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </StepperContent>

        <StepperContent value="security">
          <FieldGroup className="space-y-4">
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="register-password">
                    Password <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isPending}
                    {...field}
                  />
                  <FieldDescription>At least 8 characters.</FieldDescription>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password_confirmation"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="register-password-confirmation">
                    Confirm password <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="register-password-confirmation"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isPending}
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </StepperContent>

        <div className="mt-6 flex justify-between">
          <StepperPrev asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Previous
            </Button>
          </StepperPrev>
          <span className="flex items-center text-sm text-muted-foreground">
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          {stepIndex === STEPS.length - 1 ? (
            <Button type="submit" form="register" disabled={isPending}>
              {isPending && <Spinner className="mr-2 size-4" />}
              {isPending ? "Creating account..." : "Create account"}
            </Button>
          ) : (
            <StepperNext asChild>
              <Button type="button" disabled={isPending}>
                Next
              </Button>
            </StepperNext>
          )}
        </div>
      </Stepper>
    </form>
  )
}
