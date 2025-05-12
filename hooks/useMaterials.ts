import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Material, MaterialCategory, MaterialType } from "@/types/Material";

type UseMaterialsOptions = {
  category: MaterialCategory;
  type: MaterialType;
  classNumber: number | null;
};

export function useMaterials({
  category,
  type,
  classNumber,
}: UseMaterialsOptions) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMaterials() {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("materials")
          .select("*")
          .eq("category", category)
          .eq("type", type);

        // Add class filter only if a class is selected
        if (classNumber !== null) {
          // If classNumber is not null, fetch materials with matching class or null class
          query = query.or(`class.eq.${classNumber},class.is.null`);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        // Convert the Supabase response to our Material type
        const typedMaterials: Material[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          file_type: item.file_type,
          file_url: item.file_url,
          chapter: item.chapter,
          class: item.class,
          type: item.type,
          category: item.category,
        }));

        setMaterials(typedMaterials);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
        console.error("Error fetching materials:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMaterials();
  }, [category, type, classNumber]);

  const deleteMaterial = async (materialId: string) => {
    try {
      // First check if the user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("You must be logged in to delete materials");
      }

      // Delete the material
      const { error, status } = await supabase
        .from("materials")
        .delete()
        .eq("id", Number(materialId));

      console.log("Delete response:", { error, status });

      if (error) {
        throw new Error(error.message);
      }

      // Update the local state to remove the deleted material
      setMaterials(
        materials.filter((material) => material.id !== Number(materialId))
      );

      return { success: true };
    } catch (err) {
      console.error("Error deleting material:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  };

  return { materials, loading, error, deleteMaterial };
}
