// Generic placeholder page for navigation sections whose feature module has not
// been built yet. Keeps the sidebar links functional without any business logic.

import PageContainer from "../components/PageContainer/PageContainer.jsx";

function Placeholder({ title }) {
  return (
    <PageContainer title={title} subtitle="This module is coming soon.">
      <p style={{ color: "var(--color-text-muted)" }}>
        The {title} module will be implemented in an upcoming milestone.
      </p>
    </PageContainer>
  );
}

export default Placeholder;
