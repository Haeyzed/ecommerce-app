import { Card, CardContent } from '@/components/ui/card'
import { LockScreenContent } from '@/features/auth'

export default function LockScreenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      {/* Note: We omit CardHeader here because LockScreenContent
        already renders the user's Avatar and Name beautifully at the top.
      */}
      <Card className="w-full max-w-md pt-6">
        <CardContent>
          <LockScreenContent />
        </CardContent>
      </Card>
    </div>
  )
}