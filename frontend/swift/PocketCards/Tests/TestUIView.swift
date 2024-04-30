//
//  TestUIView.swift
//  PocketCards
//
//  Created by macmini on 2023/02/18.
//

import PencilKit
import SwiftUI

struct TestUIView: View {
    @State private var canvasView: PKCanvasView = .init()
    @State private var toolPickerIsActive = false

    var body: some View {
        CanvasView(canvasView: $canvasView, toolPickerIsActive: $toolPickerIsActive)
            .padding(10.0)
            .background(Color.gray)
    }
}

struct TestUIView_Previews: PreviewProvider {
    static var previews: some View {
        TestUIView()
    }
}
