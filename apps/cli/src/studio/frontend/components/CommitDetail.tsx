import React, { useState, useEffect, useCallback } from "react";
import {
  fetchCommit,
  updateCommit,
  deleteCommit as apiDeleteCommit,
  type CognitiveCommit,
} from "../api";
import { ConversationViewer } from "@cogcommit/ui";

interface CommitDetailProps {
  commitId: string;
  onUpdate: (commit: CognitiveCommit) => void;
  onDelete: (id: string) => void;
}

export default function CommitDetail({
  commitId,
  onUpdate,
  onDelete,
}: CommitDetailProps) {
  const [commit, setCommit] = useState<CognitiveCommit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCommit(commitId)
      .then(({ commit }) => {
        setCommit(commit);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [commitId]);

  const handleTitleChange = useCallback(
    async (newTitle: string) => {
      if (!commit) return;
      const { commit: updated } = await updateCommit(commitId, {
        title: newTitle || undefined,
      });
      setCommit({ ...commit, ...updated });
      onUpdate({ ...commit, ...updated });
    },
    [commit, commitId, onUpdate]
  );

  const handleDelete = useCallback(async () => {
    await apiDeleteCommit(commitId);
    onDelete(commitId);
  }, [commitId, onDelete]);

  if (loading || !commit) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        Loading...
      </div>
    );
  }

  return (
    <ConversationViewer
      commit={commit}
      onTitleChange={handleTitleChange}
      onDelete={handleDelete}
    />
  );
}
