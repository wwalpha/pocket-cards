//
//  WeeklyTestView.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import SwiftUI

struct WeeklyTestView: View {
    var interactor: WeeklyTestBusinessLogic?

    @ObservedObject var viewModel = WeeklyTestViewModel()

    var body: some View {
        VStack {
            if viewModel.isLoading {
                Text("Loading....")
            } else if viewModel.isFinish {
                Text("テストは終わりました")
                    .font(.system(size: 64, design: .default))
            } else {
                if viewModel.question?.choices != nil {
                    ChoiceQuestion(
                        question: viewModel.question!,
                        isShowError: viewModel.isShowError,
                        onChoice: interactor!.onChoice
                    )
                } else {
                    // Society or Science
                    FlashCard(question: viewModel.question!, action: interactor!.onAction)
                }
            }
        }.toolbar {
            ToolbarItem(placement: .principal) {
                Text("残問題数：" + viewModel.count)
                    .font(.largeTitle.bold())
                    .frame(width: 300, height: 20, alignment: .center)
                    .accessibilityAddTraits(.isHeader)
            }
        }
    }
}

extension WeeklyTestView: WeeklyTestDisplayLogic {
    func showError(index: String) {
        DispatchQueue.main.async {
            viewModel.isShowError = index
        }
    }

    func showNext(model: WeeklyTestViewModel) {
        DispatchQueue.main.async {
            viewModel.isLoading = model.isLoading
            viewModel.isFinish = model.isFinish
            viewModel.isShowError = model.isShowError
            viewModel.count = model.count
        }
        debugPrint(model.count)
        viewModel.question = model.question
    }
}

extension WeeklyTestView {
    func configureView(selected: [Curriculum]) -> some View {
        var view = self
        let interactor = WeeklyTestInteractor()
        let presenter = WeeklyTestPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        interactor.loadQuestion(selected: selected)

        view.viewModel.isLoading = true

        return view
    }
}

struct WeeklyTestView_Previews: PreviewProvider {
    static var previews: some View {
        WeeklyTestView()
            .previewInterfaceOrientation(.landscapeLeft)
    }
}