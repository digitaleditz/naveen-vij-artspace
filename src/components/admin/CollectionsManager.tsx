import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";

export interface Collection {
  id: string;
  name: string;
  created_at: string;
}

interface CollectionsManagerProps {
  collections: Collection[];
  onCollectionsChange: () => void;
}

const CollectionsManager = ({ collections, onCollectionsChange }: CollectionsManagerProps) => {
  const { toast } = useToast();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const addCollection = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    const { error } = await supabase.from("collections").insert({ name: trimmed });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setNewName("");
      onCollectionsChange();
      toast({ title: "Added", description: `Collection "${trimmed}" created` });
    }
  };

  const updateCollection = async (id: string) => {
    const trimmed = editName.trim();
    if (!trimmed) return;

    const oldCollection = collections.find((c) => c.id === id);

    const { error } = await supabase.from("collections").update({ name: trimmed }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Update artworks that reference the old collection name
      if (oldCollection) {
        await supabase
          .from("artworks")
          .update({ collection: trimmed })
          .eq("collection", oldCollection.name);
      }
      setEditingId(null);
      onCollectionsChange();
      toast({ title: "Updated", description: `Collection renamed to "${trimmed}"` });
    }
  };

  const deleteCollection = async (id: string, name: string) => {
    if (!confirm(`Delete collection "${name}"? Artworks in this collection won't be deleted but will lose their collection assignment.`))
      return;

    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      onCollectionsChange();
      toast({ title: "Deleted", description: `Collection "${name}" removed` });
    }
  };

  return (
    <div className="mb-8 p-5 bg-secondary/30 border border-border rounded-lg">
      <h3 className="font-serif text-lg mb-4">Manage Collections</h3>

      {/* Add new */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="New collection name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCollection()}
          className="max-w-xs"
        />
        <Button variant="outline" size="sm" onClick={addCollection} disabled={!newName.trim()}>
          <Plus size={14} className="mr-1" />
          Add
        </Button>
      </div>

      {/* List */}
      {collections.length === 0 ? (
        <p className="text-sm text-muted-foreground">No collections yet. Add one above.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {collections.map((col) => (
            <div
              key={col.id}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-md text-sm"
            >
              {editingId === col.id ? (
                <>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && updateCollection(col.id)}
                    className="h-7 w-32 text-sm"
                    autoFocus
                  />
                  <button onClick={() => updateCollection(col.id)} className="text-green-600 hover:text-green-700">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span>{col.name}</span>
                  <button
                    onClick={() => {
                      setEditingId(col.id);
                      setEditName(col.name);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={() => deleteCollection(col.id, col.name)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionsManager;
