//
//  CanvasView.swift
//  PocketCards
//
//  Created by macmini on 2022/10/06.
//

import PencilKit
import SwiftUI

struct CanvasView: UIViewRepresentable {
    @Binding var canvasView: PKCanvasView
    @Binding var toolPickerIsActive: Bool
    @State var toolPicker = PKToolPicker()

    func makeUIView(context _: Context) -> PKCanvasView {
        canvasView.tool = PKInkingTool(.pen, color: .red, width: 30)
        canvasView.layer.borderColor = UIColor.red.cgColor
        canvasView.drawing = PKDrawing()
        canvasView.drawingPolicy = .anyInput
        canvasView.isOpaque = true
        canvasView.backgroundColor = .clear

        if UIApplication.shared.connectedScenes.first != nil {
            toolPicker.addObserver(canvasView)
            toolPicker.setVisible(true, forFirstResponder: canvasView)
            canvasView.becomeFirstResponder()
        }

        return canvasView
    }

    func updateUIView(_ view: PKCanvasView, context _: Context) {
        toolPicker.setVisible(toolPickerIsActive, forFirstResponder: view)
    }
}
