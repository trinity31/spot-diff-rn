-- Users policies
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for anonymous users"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Seasons policies
CREATE POLICY "Seasons are viewable by everyone"
  ON seasons FOR SELECT
  USING (active = true);

-- Stages policies
CREATE POLICY "Stages are viewable by everyone"
  ON stages FOR SELECT
  USING (active = true);

-- User Progress policies
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (user_id = auth.uid());
