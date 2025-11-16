"use client";

import { CreditCard, Receipt } from "lucide-react";

export function BillingTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Subscription Section */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
            <CreditCard size={18} className="text-[var(--color-primary)]" />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-sm sm:text-base text-[var(--color-text)]">Subscription</h4>
            <p className="text-xs sm:text-sm text-[var(--color-muted)]">
              Manage your StudyMate subscription
            </p>
          </div>
        </div>

        <div className="border border-[var(--color-border)] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 bg-[var(--color-bg-darker)] hover:border-[var(--color-primary-30)] transition gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-base sm:text-lg text-[var(--color-text)]">Pro Plan</h3>
            <p className="text-xs sm:text-sm text-[var(--color-muted)]">$9.99/month</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Next billing date: November 15, 2024
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
            <span className="text-xs font-medium text-[var(--color-primary)] bg-[var(--color-primary-10)] border border-[var(--color-primary-30)] rounded-md px-2 py-0.5 whitespace-nowrap">
              Active
            </span>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button className="px-3 py-1 text-xs sm:text-sm font-medium rounded-md bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-dark)] transition flex-1 sm:flex-none">
                Change Plan
              </button>
              <button className="px-3 py-1 text-xs sm:text-sm font-medium rounded-md bg-transparent text-red-400 hover:text-red-300 transition flex-1 sm:flex-none">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div>
          <h5 className="font-medium text-xs sm:text-sm text-[var(--color-text)] mb-2">Pro Features</h5>
          <ul className="text-xs sm:text-sm text-[var(--color-muted)] space-y-1 list-none">
            <li>✓ Unlimited AI-generated quizzes</li>
            <li>✓ Advanced analytics and insights</li>
            <li>✓ Priority support</li>
            <li>✓ Custom study schedules</li>
            <li>✓ Export notes and flashcards</li>
          </ul>
        </div>
      </section>

      {/* Payment Method */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
            <CreditCard size={18} className="text-[var(--color-primary)]" />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-sm sm:text-base text-[var(--color-text)]">Payment Method</h4>
            <p className="text-xs sm:text-sm text-[var(--color-muted)]">
              Manage your payment information
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-[var(--color-border)] rounded-xl p-3 sm:p-4 bg-[var(--color-bg-darker)] hover:border-[var(--color-primary-30)] transition mb-3 gap-2">
          <div className="min-w-0">
            <p className="text-[var(--color-text)] font-medium text-sm">•••• •••• •••• 4242</p>
            <p className="text-xs text-[var(--color-muted)]">Expires 12/25</p>
          </div>
          <button className="px-3 py-1 text-xs sm:text-sm font-medium rounded-md bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-dark)] transition w-full sm:w-auto">
            Update
          </button>
        </div>

        <button className="w-full border border-[var(--color-border)] rounded-md py-2 text-xs sm:text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary-30)] transition">
          Add Payment Method
        </button>
      </section>

      {/* Billing History */}
      <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[var(--color-bg-darker)] border border-[var(--color-border)] flex-shrink-0">
            <Receipt size={18} className="text-[var(--color-primary)]" />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-sm sm:text-base text-[var(--color-text)]">Billing History</h4>
            <p className="text-xs sm:text-sm text-[var(--color-muted)]">
              View your past invoices and payments
            </p>
          </div>
        </div>

        <div className="divide-y divide-[var(--color-border)] overflow-x-auto">
          {[
            { date: "Oct 15, 2024", plan: "Pro Plan", amount: "$9.99" },
            { date: "Sep 15, 2024", plan: "Pro Plan", amount: "$9.99" },
            { date: "Aug 15, 2024", plan: "Pro Plan", amount: "$9.99" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 hover:bg-[var(--color-bg-darker)] transition rounded-md px-2 gap-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[var(--color-text)] text-xs sm:text-sm font-medium">{item.date}</p>
                <p className="text-xs text-[var(--color-muted)]">{item.plan}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs sm:text-sm text-[var(--color-text)]">{item.amount}</p>
                <span className="text-xs text-[var(--color-primary)] border border-[var(--color-primary-30)] rounded-md px-2 py-0.5 bg-[var(--color-primary-10)] whitespace-nowrap">
                  Paid
                </span>
                <button className="px-2 py-1 text-xs font-medium rounded-md bg-[var(--color-bg-darker)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary-30)] hover:text-[var(--color-primary)] transition whitespace-nowrap">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
