"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Wallet } from "lucide-react"

interface PaymentFormProps {
  onSubmit: () => void
}

export default function PaymentForm({ onSubmit }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payment Details</h2>

      <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Credit Card</span>
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>Digital Wallet</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="card">
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input id="cardName" placeholder="John Doe" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" required maxLength={19} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" required maxLength={3} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="billingAddress">Billing Address</Label>
              <Input id="billingAddress" placeholder="123 Main St" required />
            </div>
          </form>
        </TabsContent>

        <TabsContent value="wallet">
          <div className="space-y-4 mt-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground">Connect your digital wallet to complete the payment.</p>
              <Button className="mt-4 w-full">Connect Wallet</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
