
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import styles from './ModerationPanel.module.scss';

export default function ModerationPanel() {
  const [pendingArticles, setPendingArticles] = useState<Article[]>([]);
  const [rejectionReason, setRejectionReason] = useState('');


useEffect(() => {
  api.get<Article[]>('/articles/pending')
    .then(setPendingArticles)
    .catch(err => console.error('Failed to obtain the article for review:', err));
}, []);


  const handleApprove = async (id: string) => {
    try {
      await api.put(`/articles/${id}/approve`,{});
      setPendingArticles(prev => prev.filter(article => article._id !== id));
    } catch (error) {
      alert('Approval operation failed');
    }
  };


  const handleReject = async (id: string) => {
    if (!rejectionReason) return alert('Please enter the reason for rejection');
    
    try {
      await api.put(`/articles/${id}/reject`, { reason: rejectionReason });
      setPendingArticles(prev => prev.filter(article => article._id !== id));
      setRejectionReason('');
    } catch (error) {
      alert('Reject operation failed');
    }
  };

  return (
    <div className={styles.panel}>
      {pendingArticles.map(article => (
        <div key={article._id} className={styles.articleCard}>
          <h3>{article.title}</h3>
          <p>{article.content.substring(0, 100)}...</p>
          
          <div className={styles.actions}>
            <button 
              className={styles.approveButton}
              onClick={() => handleApprove(article._id)}
            >
            
            </button>
            
            <div className={styles.rejectSection}>
              <input
                type="text"
                placeholder="Reson"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className={styles.reasonInput}
              />
              <button
                className={styles.rejectButton}
                onClick={() => handleReject(article._id)}
              >
               
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}