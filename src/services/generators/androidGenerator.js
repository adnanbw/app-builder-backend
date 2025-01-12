// androidGenerator.js
import fs from 'fs';
import path from 'path';

export function generateAndroidFiles(project) {
  const outputPath = path.join('/tmp', `android-${project.id}`);
  fs.mkdirSync(outputPath, { recursive: true });

  // Generate XML Layouts
  project.designs.forEach((screen) => {
    const layoutXML = generateLayoutXML(screen);
    fs.writeFileSync(path.join(outputPath, `${screen.screen_name}.xml`), layoutXML);
  });

  // Generate Kotlin Activities
  project.designs.forEach((screen) => {
    const activityCode = generateActivityCode(screen.screen_name);
    fs.writeFileSync(path.join(outputPath, `${screen.screen_name}Activity.kt`), activityCode);
  });

  // Generate AndroidManifest.xml
  const manifest = generateAndroidManifest(project.designs);
  fs.writeFileSync(path.join(outputPath, 'AndroidManifest.xml'), manifest);

  return outputPath;
}

function generateLayoutXML(screen) {
  // Example for generating a TextView
  return `
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    ${screen.elements.map((el) => renderElement(el)).join('\n')}
</LinearLayout>`;
}

function generateActivityCode(screenName) {
  return `
package com.example.generatedapp;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class ${screenName}Activity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.${screenName.toLowerCase()});
    }
}`;
}

function generateAndroidManifest(designs) {
  return `
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.generatedapp">
    <application android:label="Generated App">
        ${designs.map((screen) => `
        <activity android:name=".${screen.screen_name}Activity" />
        `).join('\n')}
    </application>
</manifest>`;
}
