(ns metabase.models.annotation
  (:require [korma.core :refer :all]
            [metabase.db :refer :all]
            (metabase.models [common :refer :all]
                             [hydrate :refer [realize-json]]
                             [org :refer [Org]]
                             [user :refer [User]])
            [metabase.util :as util]))


(def annotation-general 0)
(def annotation-description 1)


(defentity Annotation
  (table :annotation_annotation))


(defmethod pre-insert Annotation [_ annotation]
  (let [defaults {:created_at (util/new-sql-timestamp)
                  :updated_at (util/new-sql-timestamp)}]
    (merge defaults annotation)))


(defmethod pre-update Annotation [_ annotation]
  (assoc annotation :updated_at (util/new-sql-timestamp)))


(defmethod post-select Annotation [_ {:keys [organization_id author_id] :as annotation}]
  (-> annotation
      ;; TODO - would probably be nice to associate a function which pulls the object the annotation points to
      (assoc :author (delay (sel :one User :id author_id))
             :organization (delay (sel :one Org :id organization_id)))))