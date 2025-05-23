// frontend/src/pages/articles/moderate.tsx
import ModerationPanel from '../../components/moderation/ModerationPanel';

export default function ModerationPage() {
  return (
    <div className="moderation-container">
      <h1>Article review panel</h1>
      <ModerationPanel />
    </div>
  )
}