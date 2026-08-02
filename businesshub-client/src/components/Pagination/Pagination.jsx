// Simple previous/next pagination. Renders nothing for a single page.

import Button from "../Button/Button.jsx";
import styles from "./Pagination.module.css";

function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <Button
        variant="secondary"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </Button>
      <span className={styles.info}>
        Page {page} of {totalPages}
      </span>
      <Button
        variant="secondary"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
